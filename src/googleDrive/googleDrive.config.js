// import { gapi } from 'gapi-script';

// let auth;

// export const authenticateGoogleDrive = () => {
//     gapi.client.init({
//         apiKey: "Your-API-KEY",
//         clientId:"Your-Oath-ClientID",
//         scope: "https://www.googleapis.com/auth/drive",
//       });
// };

// export const uploadFile = async (file, folderId) => {
//     const metadata = {  
//       name: file.name, // Nombre del archivo que aparecerá en Google Drive
//       parents: [folderId], // ID de la carpeta donde deseas subir el archivo
//     };
  
//     const formData = new FormData();
//     formData.append(
//       "metadata",
//       new Blob([JSON.stringify(metadata)], { type: "application/json" })
//     );
//     formData.append("file", file); // El archivo que deseas subir
  
//     try {
//       const response = await gapi.client.request({
//         path: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
//         method: "POST",
//         body: formData,
//       });
  
//       console.log("Archivo subido con éxito:", response.result);
//       return response.result; // Devuelve los detalles del archivo subido
//     } catch (error) {
//       console.error("Error al subir archivo:", error);
//       throw error;
//     }
//   };