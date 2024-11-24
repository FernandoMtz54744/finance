import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase/firebase.config';
import { getNextFechaByDay, toLocaleEs } from '../src/utils/utils';
import { DateTime } from 'luxon';
const sgMail = require('@sendgrid/mail')

export async function GET() {
    const diasAntes = [18,10,7,0];
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
    }catch(error){
        console.log(error);
    }

    
    return new Response(`${emailed} Tarjetas de ${tarjetas.length}`)  
}