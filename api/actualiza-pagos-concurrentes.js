import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { DateTime } from "luxon";
import { db } from "../src/firebase/firebase.config";
import { getFechaLimitePagoByDays, getLastFechaByPeriodicity, getNextFechaByPeriodicity } from "../src/utils/utils";

export async function GET() {
    const diasAntes = [10,5,3,2];
    const pagos = [];
    try{
        const snapshot = await getDocs((query(collection(db, "PagosConcurrentes"))));
        snapshot.docs.forEach(pago =>{
            pagos.push({...pago.data(), idPago: pago.id});
        });

        const hoy = DateTime.local().startOf("day");
        console.log("------")
        for(const pago of pagos){
            const proximoPago = DateTime.fromISO(pago.proximoPago);
            if(proximoPago.hasSame(hoy, "day")){
                const data = {
                    pagado: false,
                    fechaInicio: getLastFechaByPeriodicity(pago.fechaPago, pago.periodicidad),
                    proximoPago: getNextFechaByPeriodicity(pago.fechaPago, pago.periodicidad)
                }
                await updateDoc(doc(db, "PagosConcurrentes", pago.idPago), data);
                console.log("Se actualizó el pago correctamente");
            }
            if(pago.hasFechaLimite && !pago.pagado){
                const fechaLimite = DateTime.fromISO(getFechaLimitePagoByDays(pago.fechaInicio, pago.diasLimitePago));
                const diff = fechaLimite.diff(hoy, ["days"]).days;
                if(diasAntes.includes(diff)){
                    console.log("Fecha límite")
                }
            }

        }
    }catch(error){
        console.log(error);
    }
    return new Response("Pagos actualizados")  
}
