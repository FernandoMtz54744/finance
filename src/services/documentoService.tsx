import { db } from "@/firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { FileUploadFile } from "primereact/fileupload";

const API_DOCUMENTO = "/api/subir-archivo"

/* SERVICE PARA MANEJAR LOS DOCUMENTOS */
export const subirDocumento = async (file: FileUploadFile, fileName: string, periodoId: string): Promise<void> => {
    try{
        const base64File = await fileToBase64(file);
        const response = await fetch(API_DOCUMENTO, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: base64File,
                fileName: fileName,
                mime: file.type
            }) 
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }
        console.log("Archivo guardado en Google Drive");
        await updateDocumento(data.link, periodoId);
    }catch(error){
        console.log(error);
        throw error;
    }
}

//Convierte el archivo a Base64
function fileToBase64(file: FileUploadFile): Promise<string>{
    return new Promise((resolve, reject) =>{
        const reader = new FileReader();
        reader.onload = ()=> {
            const result = reader.result;
            if(typeof result === "string"){
                resolve(result.split(",")[1]);
            }else{
                reject(new Error("Error al convertir el archivo a base64"));
            }
        }
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

//Actualiza el link del documento en la BD
function updateDocumento(link: string, periodoId: string): Promise<void>{
    return new Promise((resolve, reject) =>{
        setDoc(doc(db, "Movimientos", periodoId), {documento: link}, {merge: true}).then(()=>{
            console.log("Link del documento actualizado en BD");
            resolve();
        }).catch((error)=>{
            reject(error);
        });
    })
  }
