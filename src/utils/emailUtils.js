import emailjs from "@emailjs/nodejs"

export async function enviarEmail(destinatario, mensaje){
    try{
        await emailjs.send("service_educdoa", "template_qemfv7h",{
            mensaje: mensaje,
            to: destinatario,
            reply_to: "FinanceByFerDevs@gmail.com"
        },{publicKey: process.env.EMAILJS_PUBLIC_KEY})
    }catch(error){
        console.log(error);
        throw error;
    }
}