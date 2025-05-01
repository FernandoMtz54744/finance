import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { DateTime } from "luxon";
import { db } from '../src/firebase/firebaseAPI.config.js';
import { Pago } from "@/interfaces/Pago";
import * as Utils from "../src/utils/utils.js"

export default async function handler(req: any, res: any){
    if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
    const pagos: Pago[] = [];
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
            const proximoPago = DateTime.fromJSDate(pago.proximoPago).startOf("day");
            if(proximoPago.hasSame(hoy, "day")){
                const data = {
                    isPagado: false,
                    ultimoPago: hoy.toJSDate(),
                    proximoPago: Utils.obtenerProximoPago(pago)
                }
                await updateDoc(doc(db, "PagosRecurrentes", pago.id!), data);
            }
        }
        return res.status(200).json({ message: "Pagos actualizados" });   
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: "Error al actualizar los pagos" });
    }
}



