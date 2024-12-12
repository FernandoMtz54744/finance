// import { google } from "googleapis";

let auth;

// export const authenticateGoogleDrive = () => {
//   auth = new google.auth.GoogleAuth({
//     keyFile: `finance-444518-59e38148b0e8.json`,
//     scopes: "https://www.googleapis.com/auth/drive",
//   });
// };

// export const uploadToGoogleDrive = async (file) => {
//     const fileMetadata = {
//       name: file.originalname,
//       parents: ["1T8smHRI3g1Or9pSjxsV_BDFvR4LepqZu"], // Change it according to your desired parent folder id
//     };
  
//     const media = {
//       mimeType: file.mimetype,
//       body: fs.createReadStream(file.path),
//     };
  
//     const driveService = google.drive({ version: "v3", auth });
  
//     const response = await driveService.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });
//     return response;
//   };