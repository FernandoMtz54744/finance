const admin = require("firebase-admin");

try{
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": "service_account",
            "project_id": process.env.REACT_APP_PROJECT_ID,
            "private_key_id": process.env.REACT_APP_CM_PRIVATE_KEY_ID,
            "private_key": Buffer.from(process.env.REACT_APP_CM_PRIVATE_KEY, "base64").toString("ascii"),
            "client_email": "firebase-adminsdk-bc1ei@finance-b00a5.iam.gserviceaccount.com",
            "client_id": "117133029602070062487",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-bc1ei%40finance-b00a5.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        })
    });
}catch(error){
    console.log(error);
}

export async function enviarNotificacion(messageBody, messageTitle, tokenDestinatario) {
    try {
        const message = {
            token: tokenDestinatario,
            notification: {
                title: messageTitle,
                body: messageBody
            },
        };

        await admin.messaging().send(message);
        return true;
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
            return false;
        }
    }