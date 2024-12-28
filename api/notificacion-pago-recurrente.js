import { enviarNotificacion } from "../src/utils/notificacionUtils";

export async function GET() {
    
    const enviado = await enviarNotificacion("Prueba de mensaje utils","Title notificacion","cUGEp02_QmFzHNyQePr8wD:APA91bE16UiP6eKpZqv539sb-8wCVv6yeh_yEoY62sqP25FdKYPQLgsCTGvrXz0xSH9FW1hYsotu3Usxo-PzQ4xyLhoiaYTFRyLpFQLvlK00ymT3pwo_10M")
    if(enviado){
        return new Response("Notificación enviada");
    }else{
        return new Response("No se envió la notificación");
    }
}
