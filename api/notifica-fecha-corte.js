import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { DateTime } from 'luxon';
import { getNextFechaByDay } from '../src/utils/utils';
import { enviarEmail } from '../src/utils/emailUtils';

export async function GET() {
    const tarjetas = [];
    let emailed = 0;
    try{
        const snapshot = await getDocs((query(collection(db, "Tarjetas"))));
        snapshot.docs.forEach(tarjeta =>{
            tarjetas.push(tarjeta.data())
        });

        const hoy = DateTime.local();
        for(const tarjeta of tarjetas){
            const fechaCorte = DateTime.fromISO(tarjeta.fechaCorte);
            const fechaRevisarCorte = fechaCorte.plus({days: 1});
            if(hoy.day === fechaRevisarCorte.day){
                const fechaCorteFormatted = DateTime.fromISO(getNextFechaByDay(fechaCorte.toISODate())).setLocale("es")
                                    .toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });

                const mensaje = `El día de ayer ${fechaCorteFormatted} fue la fecha de corte de tu tarjeta de ${tarjeta.tipo} ${tarjeta.alias}, 
                no olvides consultar su estado de cuenta.`                   
                const enviado = await enviarEmail(tarjeta.correo, mensaje);
                emailed++;
            }
        }
    }catch(error){
        console.log(error);
    }
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}
