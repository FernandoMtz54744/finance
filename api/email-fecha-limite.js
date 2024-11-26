import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { getNextFechaByDay } from '../src/utils/utils';
import { DateTime } from 'luxon';
import emailjs from "@emailjs/nodejs"

export async function GET() {
    const diasAntes = [18,10,7,0];
    const hoy = DateTime.local().startOf("day");
    const tarjetas = [];
    let emailed = 0;
    try{
        const snapshot = await getDocs((query(collection(db, "Tarjetas"),where("fechaLimitePago", "!=", ""))));
        snapshot.docs.forEach(tarjeta =>{
            tarjetas.push(tarjeta.data())
        });

        for(const tarjeta of tarjetas){
            const proximaFechaLimite = DateTime.fromISO(getNextFechaByDay(tarjeta.fechaLimitePago));
            const diff = proximaFechaLimite.diff(hoy, ["days"]).days;
            if(diasAntes.includes(diff)){
                const limiteFormatted = proximaFechaLimite.toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                await emailjs.send("service_educdoa", "template_ituk95n",{
                    dias: diff,
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