import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
const sgMail = require('@sendgrid/mail')
import { DateTime } from 'luxon';
import { getNextFechaByDay } from '../src/utils/utils';

export async function GET() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
                const hoyFormatted = DateTime.fromISO(getNextFechaByDay(fechaCorte.toISODate()))
                                    .toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' });
                const msg = {
                    to: tarjeta.correo,
                    from: 'financebyferdevs@gmail.com',
                    subject: 'Recordatorio fecha de corte',
                    text: `El día de hoy es la fecha de corte de tu tarjeta, no olvides revisar tu estado de cuenta.`,
                    html: `<strong>El día de hoy ${hoyFormatted} es la fecha de corte de tu tarjeta ${tarjeta.alias} ${tarjeta.tipo}, no olvides revisar tu estado de cuenta<p>-Finance By FerDevs</p></strong>`,
                }
                await sgMail.send(msg)
                emailed++;
            }
        }
    }catch(error){
        console.log(error);
    }
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}
