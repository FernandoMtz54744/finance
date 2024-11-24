import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
const sgMail = require('@sendgrid/mail')

export async function GET() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const hoy = new Date();
    const tarjetas = [];
    try{
        const snapshot = await getDocs((query(collection(db, "Tarjetas"))));
        snapshot.docs.forEach(tarjeta =>{
            tarjetas.push(tarjeta.data())
        });
    }catch(error){
        console.log(error);
    }

    let emailed = 0;
    try{
        for(const tarjeta of tarjetas){
            const fechaCorte = new Date(tarjeta.fechaCorte);
            if(hoy.getDate() === fechaCorte.getDate()){
                const hoyFormatted = fechaCorte.toLocaleDateString();
                const msg = {
                    to: tarjeta.correo,
                    from: 'fernando.mtz.devs@gmail.com',
                    subject: 'Recordatorio fecha de corte',
                    text: `El día de hoy es la fecha de corte de tu tarjeta, no olvides revisar tu estado de cuenta.`,
                    html: `<strong>El día de hoy ${hoyFormatted} es la fecha de corte de tu tarjeta ${tarjeta.alias} ${tarjeta.tipo}, no olvides revisar tu estado de cuenta<p>-Finance By FerDevs</p></strong>`,
                }
                await sgMail.send(msg)
                emailed++;
            }
        }
    }catch(error){
        console.log(error)
    }
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}
