import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);


export const generateToken = async ()=>{
  const permission = await Notification.requestPermission();
  if(permission === "granted"){
    const token = await getToken(messaging, {
      vapidKey: "BLU9RO4kUTgZA9w_Ok9NwDZhYWi_-igV1Dy54zQJrSRzDcYXuYliTgim6Jy3WF2hxGuxuRp1BjDZ30DCDd17SBk"
    })
    console.log(token)
  }
}