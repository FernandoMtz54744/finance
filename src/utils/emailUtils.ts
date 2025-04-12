import emailjs from "@emailjs/nodejs"

export async function enviarEmail(destinatario: string, mensaje: string): Promise<void>{
    try{
        await emailjs.send("service_educdoa", "template_qemfv7h",{
            mensaje: mensaje,
            to: destinatario,
            reply_to: "FinanceByFerDevs@gmail.com"
        },{publicKey: import.meta.env.EMAILJS_PUBLIC_KEY})
    }catch(error){
        console.log(error);
        throw error;
    }
}