import { collection, getDocs, query } from "firebase/firestore";
import { DateTime } from "luxon";
import { db } from '../src/firebase/firebaseAPI.config.js';
import * as Utils from "../src/utils/utils.js";
import { enviarEmail } from "../src/utils/emailUtils.js";
import { Pago } from "@/interfaces/Pago";

const diasAntes = [18,10,5,3,2];

export default async function handler(req: any, res: any){
    if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
    const pagos: Pago[] = [];
    let emailed = 0;
    try{
        const snapshot = await getDocs((query(collection(db, "PagosRecurrentes"))));
        snapshot.docs.forEach(pago =>{
            const data = pago.data()
            pagos.push({
                id: pago.id,
                idUsuario: data.idUsuario,
                nombre: data.nombre,
                cantidad: data.cantidad,
                periodicidad: data.periodicidad,
                correo: data.correo,
                isPagado: data.isPagado,
                ultimoPago: data.ultimoPago.toDate(),
                proximoPago: data.proximoPago.toDate(),
                diasLimitePago: data.diasLimitePago,
                diasAntesNotificacion: data.diasAntesNotificacion,
                auditar: data.auditar
            });
        });

        const hoy = DateTime.local().startOf("day");
        for(const pago of pagos){
            const fechaPago = DateTime.fromJSDate(pago.proximoPago);
            const fechaCargo = DateTime.fromJSDate(pago.ultimoPago); //Considerando que se actualiza ultimoPago como el mismo día
            if(fechaPago.equals(hoy) || fechaCargo.equals(hoy)){ //Avisa los pagos el mismo día
                const mensaje = `El día de hoy se debe realizar tu pago recurrente de ${pago.nombre}.
                No olvides marcarlo como pagado una vez concluido.
                Cantidad del pago ${Utils.currencyFormat(pago.cantidad)}`
                await enviarEmail(pago.correo, mensaje);
                emailed++;
            }
            if(pago.diasAntesNotificacion > 0){
                if(fechaPago.minus({days: pago.diasAntesNotificacion}).equals(hoy)){
                    const mensaje = `En ${pago.diasAntesNotificacion} días se debe realizar tu pago recurrente de ${pago.nombre}.
                    Cantidad del pago ${Utils.currencyFormat(pago.cantidad)}`
                    await enviarEmail(pago.correo, mensaje);
                    emailed++;
                }
            }
            if(pago.diasLimitePago && !pago.isPagado){
                const fechaLimite = DateTime.fromJSDate(Utils.getFechaLimitePagoByDays(pago.ultimoPago, pago.diasLimitePago));
                const fechaLimiteFormatted = fechaLimite.setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                const diff = fechaLimite.diff(hoy, ["days"]).days;
                if(diasAntes.includes(diff)){
                    const mensaje = `No has realizado tu pago recurrente de ${pago.nombre} y faltan ${diff} días para la fecha límite.
                    Fecha límite: ${fechaLimiteFormatted}
                    Cantidad: ${Utils.currencyFormat(pago.cantidad)}`
                    await enviarEmail(pago.correo, mensaje)
                    emailed++;
                }
            }
        }
        return res.status(200).json({ message:`Pagos notificados: ${emailed} de ${pagos.length}`});
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Error al notificar los pagos"});
    }
}
