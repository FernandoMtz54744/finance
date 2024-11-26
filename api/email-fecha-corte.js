import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { DateTime } from 'luxon';
import { getNextFechaByDay } from '../src/utils/utils';
import emailjs from "@emailjs/nodejs"

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
            if(hoy.day === fechaCorte.day){
                const hoyFormatted = DateTime.fromISO(getNextFechaByDay(fechaCorte.toISODate())).setLocale("es")
                                    .toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                await emailjs.send("service_educdoa", "template_hzw5wwm",{
                    fecha: hoyFormatted,
                    tarjeta: tarjeta.alias,
                    tipo: tarjeta.tipo,
                    to: tarjeta.correo,
                    reply_to: "FinanceByFerDevs@gmail.com"
                },{publicKey: process.env.EMAILJS_PUBLIC_KEY})
                emailed++;
            }
        }
    }catch(error){
        console.log(error);
    }
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}
