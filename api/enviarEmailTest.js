import { enviarEmail } from "../src/utils/emailUtils";


export async function GET() {
    const enviado = await enviarEmail("fer_f@outlook.com", "Prueba de mensaje correo utils");

    if(enviado){
        return new Response("Email enviado");
    }else{
        return new Response("No se envió el email");
    }
}