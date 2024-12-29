import { collection, getDocs, query } from "firebase/firestore";
import { DateTime } from "luxon";
import { db } from "../src/firebase/firebase.config";
import { currencyFormat, getFechaLimitePagoByDays } from "../src/utils/utils";
import { enviarEmail } from "../src/utils/emailUtils";

const diasAntes = [18,10,5,3,2];

export async function GET() {
    let emailed = 0;
    const pagos = [];
    try{
        const snapshot = await getDocs((query(collection(db, "PagosConcurrentes"))));
        snapshot.docs.forEach(pago =>{
            pagos.push({...pago.data(), idPago: pago.id});
        });

        const hoy = DateTime.local().startOf("day");
        for(const pago of pagos){
            const fechaPago = DateTime.fromISO(pago.fechaInicio);
            if(fechaPago.hasSame(hoy, "day")){
                const mensaje = `El día de hoy se debe realizar tu pago recurrente de ${pago.nombre}.
                No olvides marcarlo como pagado una vez concluido.
                Cantidad del pago ${currencyFormat(pago.cantidad)}`
                await enviarEmail(pago.correo, mensaje);
                emailed++;
            }
            if(pago.hasFechaLimite && !pago.pagado){
                const fechaLimite = DateTime.fromISO(getFechaLimitePagoByDays(pago.fechaInicio, pago.diasLimitePago));
                const fechaLimiteFormatted = fechaLimite.setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                const diff = fechaLimite.diff(hoy, ["days"]).days;
                if(diasAntes.includes(diff)){
                    const mensaje = `No has realizado tu pago recurrente de ${pago.nombre} y faltan ${diff} días para la fecha límite.
                    Fecha límite: ${fechaLimiteFormatted}
                    Cantidad: ${currencyFormat(pago.cantidad)}`
                    await enviarEmail(pago.correo, mensaje)
                    emailed++;
                }
            }
        }
    }catch(error){
        console.log(error);
    }
    return new Response(`Pagos notificados: ${emailed} de ${pagos.length}`)  
}
