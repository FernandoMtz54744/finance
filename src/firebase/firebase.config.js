import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const messaging = getMessaging(app);


// export const generateToken = async ()=>{
//   const permission = await Notification.requestPermission();
//   if(permission === "granted"){
//     const token = await getToken(messaging, {
//       vapidKey: "BLU9RO4kUTgZA9w_Ok9NwDZhYWi_-igV1Dy54zQJrSRzDcYXuYliTgim6Jy3WF2hxGuxuRp1BjDZ30DCDd17SBk"
//     })
//     console.log(token)
//   }
// }