import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase/firebaseAPI.config.js';
import * as Utils from '../src/utils/utils.js';
import { DateTime } from 'luxon';
import { enviarEmail } from '../src/utils/emailUtils.js';
import { Tarjeta } from '@/interfaces/Tarjeta.js';
import { Periodo } from '@/interfaces/Periodo.js';

export default async function handler(req: any, res: any){
    if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

    const diasAntes = [18,14,10,5,3,2];
    const hoy = DateTime.local().startOf("day");
    const tarjetas: Tarjeta[] = [];
    let emailed = 0;

    try{
        //Se obtienen las tarjetas
        const snapshot = await getDocs((query(collection(db, "Tarjetas"),where("tipo", "==", "Crédito"))));
        snapshot.docs.forEach(tarjeta =>{
            const data = tarjeta.data();
            tarjetas.push({
                id: tarjeta.id,
                diaCorte: data.diaCorte,
                correo: data.correo,
                idUsuario: data.idUsuario,
                color: data.color,
                nombre: data.nombre,
                tipo: data.tipo
            })
        });

        for(const tarjeta of tarjetas){
            const proximaFechaLimite = DateTime.fromJSDate(Utils.getFechaLimitePago(Utils.getLastFechaByDay(tarjeta.diaCorte)))
            const diff = proximaFechaLimite.diff(hoy, ["days"]).days;
            if(diasAntes.includes(diff)){//Si faltan x días para fecha límite de pago
                const limiteFormatted = proximaFechaLimite.setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                let enviarCorreo = true;
                let mensaje = "";
                //Se obtienen los periodos
                const result = await getDocs(query(collection(db, "Periodos"), where('idTarjeta', '==', tarjeta.id)));
                //Se filtra el periodo que se debe pagar
                const periodoFilter = result.docs.filter(periodo => {
                    const data = periodo.data();
                        const periodoData: Periodo = {
                            ...data,
                            id: periodo.id,
                            fechaCorte: data.fechaCorte.toDate(),
                            fechaInicio: data.fechaInicio.toDate(),
                        } as Periodo;
                        const fechaCortePeriodo = DateTime.fromJSDate(periodoData.fechaCorte);
                        const fechaLimitePeriodo = DateTime.fromJSDate(Utils.getFechaLimitePago(periodoData.fechaCorte));
                        return (hoy >= fechaCortePeriodo && hoy <= fechaLimitePeriodo)
                    }
                );
                
                if(periodoFilter.length === 1){//Se obtuvo el periodo actual
                    const periodoData = periodoFilter[0].data();
                    if(periodoData.totalPeriodo < 0){//Solo se envía notificación si hay una cantidad que pagar
                        mensaje = `Faltan ${diff} días para la fecha límite de pago tu tarjeta ${tarjeta.nombre} ${tarjeta.tipo}, no olvides realizar el pago.
                        \nFecha límite de pago: ${limiteFormatted}
                        Pago pendiente de: ${Utils.currencyFormat(periodoData.totalPeriodo)}`
                    }else{
                        enviarCorreo = false;
                    }
                }else{ //No hay un periodo registrado pero se notifica fecha de pago
                    mensaje = `Faltan ${diff} días para la fecha límite de pago tu tarjeta ${tarjeta.nombre} ${tarjeta.tipo}, no olvides realizar el pago.
                    Fecha límite de pago: ${limiteFormatted}\n
                    \nNo se han cargado los movimientos, por lo que se sugiere cargar el estado de cuenta para saber la cantidad del pago.`
                }
                if(enviarCorreo){
                    await enviarEmail(tarjeta.correo, mensaje);
                    emailed++;
                }
            }
        }
        res.status(200).json({message: `${emailed} Tarjetas de ${tarjetas.length}`})
    }catch(error){
        console.log(error);
        res.satus(500).json({message: "Error al enviar notificación de fecha límite de pago"});
    }
}