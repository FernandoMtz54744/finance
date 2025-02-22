import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { currencyFormat, getFechaLimitePago, getLastFechaByDay } from '../src/utils/utils';
import { DateTime } from 'luxon';
import { enviarEmail } from '../src/utils/emailUtils';

export async function GET() {
    const diasAntes = [18,14,10,5,3,2];
    const hoy = DateTime.local().startOf("day");
    const tarjetas = [];
    let emailed = 0;
    try{
        //Se obtienen las tarjetas
        const snapshot = await getDocs((query(collection(db, "Tarjetas"),where("tipo", "==", "Crédito"))));
        snapshot.docs.forEach(tarjeta =>{
            tarjetas.push({...tarjeta.data(), idTarjeta: tarjeta.id})
        });
        for(const tarjeta of tarjetas){
            const proximaFechaLimite = DateTime.fromISO(getFechaLimitePago(getLastFechaByDay(tarjeta.fechaCorte)))
            const diff = proximaFechaLimite.diff(hoy, ["days"]).days;
            const limiteFormatted = proximaFechaLimite.setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
            if(diasAntes.includes(diff)){//Si faltan x días para fecha límite de pago
                let enviarCorreo = true;
                let mensaje = "";
                //Se obtienen los periodos
                const result = await getDocs(query(collection(db, "Periodos"), where('idTarjeta', '==', tarjeta.idTarjeta)));
                //Se filtra el periodo que se debe pagar
                const periodoFilter = result.docs.filter(periodo => {
                        const periodoData = periodo.data();
                        const fechaCortePeriodo = DateTime.fromISO(periodoData.fechaCorte);
                        const fechaLimitePeriodo = DateTime.fromISO(periodoData.fechaLimitePago);
                        return (hoy >= fechaCortePeriodo && hoy <= fechaLimitePeriodo)
                    }
                );
                
                if(periodoFilter.length === 1){//Se obtuvo el periodo actual
                    const periodoData = periodoFilter[0].data();
                    if(periodoData.totalPeriodo < 0){//Solo se envía notificación si hay una cantidad que pagar
                        mensaje = `Faltan ${diff} días para la fecha límite de pago tu tarjeta ${tarjeta.alias} ${tarjeta.tipo}, no olvides realizar el pago.
                        \nFecha límite de pago: ${limiteFormatted}
                        Pago pendiente de: ${currencyFormat(periodoData.totalPeriodo)}`
                    }else{
                        enviarCorreo = false;
                    }
                }else{ //No hay un periodo registrado pero se notifica fecha de pago
                    mensaje = `Faltan ${diff} días para la fecha límite de pago tu tarjeta ${tarjeta.alias} ${tarjeta.tipo}, no olvides realizar el pago.
                    Fecha límite de pago: ${limiteFormatted}\n
                    \nNo se han cargado los movimientos, por lo que se sugiere cargar el estado de cuenta para saber la cantidad del pago.`
                }
                if(enviarCorreo){
                    await enviarEmail(tarjeta.correo, mensaje);
                    emailed++;
                }
            }
        }
    }catch(error){
        console.log(error);
    }

    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}