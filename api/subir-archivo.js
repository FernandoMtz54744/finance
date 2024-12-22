const { google } = require('googleapis');
const streamifier = require('streamifier');

const SCOPE = ['https://www.googleapis.com/auth/drive'];

//Funcion que maneja el post
export async function POST (req, res) {
    try {
        //Se obtiene el archivo
        const {file, fileName, mime} = await req.json()

        //Se realiza la autenticación
        const jwtClient = new google.auth.JWT(
            process.env.GOOGLE_DRIVE_EMAIL,
            null,
            Buffer.from(process.env.GOOGLE_DRIVE_PRIVATE_KEY, "base64").toString("ascii"),
            SCOPE
        );
        await jwtClient.authorize();

        //Se sube el archivo
        const drive = google.drive({ version: 'v3', auth: jwtClient });
        const fileMetaData = {
            name: fileName,
            parents: ["1DyFl7lGsXOWXTqWmnwuz-isa-PkSJPmg"]
        }
        
        const response = await drive.files.create({
            resource: fileMetaData,
            media: {
                body: streamifier.createReadStream(Buffer.from(file, 'base64')),
                mimeType: mime,
            },
            fields: "webViewLink",
        }, );

        return new Response(JSON.stringify({link: response.data.webViewLink}));
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        return new Response(JSON.stringify({ error: "Error al subir el archivo", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};