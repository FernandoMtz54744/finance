import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { DateTime } from "luxon";
import { db } from "../src/firebase/firebase.config";
import { getFechaLimitePagoByDays, getLastFechaByPeriodicity, getNextFechaByPeriodicity } from "../src/utils/utils";

const diasAntes = [10,5,3,2];

export async function GET() {
    try{
        const pagos = [];
        const snapshot = await getDocs((query(collection(db, "PagosConcurrentes"))));
        snapshot.docs.forEach(pago =>{
            pagos.push({...pago.data(), idPago: pago.id});
        });

        const hoy = DateTime.local().startOf("day");
        for(const pago of pagos){
            const proximoPago = DateTime.fromISO(pago.proximoPago);
            if(proximoPago.hasSame(hoy, "day")){
                const data = {
                    pagado: false,
                    fechaInicio: getLastFechaByPeriodicity(pago.fechaPago, pago.periodicidad),
                    proximoPago: getNextFechaByPeriodicity(pago.fechaPago, pago.periodicidad)
                }
                await updateDoc(doc(db, "PagosConcurrentes", pago.idPago), data);
            }
        }
    }catch(error){
        console.log(error);
    }
    return new Response("Pagos actualizados")  
}
