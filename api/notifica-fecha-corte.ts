import { collection, getDocs, query } from 'firebase/firestore';
import { DateTime } from 'luxon';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { db } from '../src/firebase/firebaseAPI.config.js';
import { enviarEmail } from '../src/utils/emailUtils.js';

export default async function handler(req: any, res: any){
    if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
    const tarjetas: Tarjeta[] = [];
    let emailed = 0;
    try{
        const snapshot = await getDocs((query(collection(db, "Tarjetas"))));
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

        const hoy = DateTime.local();
        console.log(hoy.day)
        for(const tarjeta of tarjetas){
            if(hoy.day === (tarjeta.diaCorte % 31 + 1)){
                const ayer = hoy.minus({days: 1});
                const fechaCorteFormatted = ayer.setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                const mensaje = `El día de ayer ${fechaCorteFormatted} fue la fecha de corte de tu tarjeta ${tarjeta.tipo} ${tarjeta.nombre}, no olvides consultar su estado de cuenta.`                   
                await enviarEmail(tarjeta.correo, mensaje);
                emailed++;
            }
        }
        res.status(200).json({ message: `${emailed} Tarjetas de ${tarjetas.length}` });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Error al notificar fecha de corte" });
    }

}
