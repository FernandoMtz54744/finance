import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { getNextFechaByDay, toLocaleEs } from '../src/utils/utils';

export async function GET() {
    const sgMail = require('@sendgrid/mail')
    const fns = require('date-fns')
    const diasAntes = [18,10,7,0];
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const hoy = new Date();
    const tarjetas = [];
    try{
        const snapshot = await getDocs((query(collection(db, "Tarjetas"),where("fechaLimitePago", "!=", ""))));
        snapshot.docs.forEach(tarjeta =>{
            tarjetas.push(tarjeta.data())
        });
    }catch(error){
        console.log(error);
    }

    let emailed = 0;
    for(const tarjeta of tarjetas){
        const proximaFechaLimite = getNextFechaByDay(tarjeta.fechaLimitePago);
        const diff = fns.differenceInDays(proximaFechaLimite, hoy);
        if(diasAntes.includes(diff)){
            const limiteFormatted = toLocaleEs(fns.format(proximaFechaLimite,"dd/MM/yyyy"));
            const msg = {
                to: tarjeta.correo,
                from: 'fernando.mtz.devs@gmail.com',
                subject: 'Recordatorio fecha límite de pago',
                text: `Faltan pocos días para el pago de tu tarjeta de crédito`,
                html: `<strong>Faltan ${diff} días para la fecha límite de tu tarjeta ${tarjeta.alias} ${tarjeta.tipo}, no olvides realizar el pago.
                        <p>Fecha límite: ${limiteFormatted}</p><p>-Finance By FerDevs</p></strong>`,
            }
            await sgMail.send(msg)
            emailed++;
        }
    }
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}