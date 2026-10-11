// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, onMessage, register, onRegistered, getToken } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let messaging = null;
if (typeof window !== 'undefined') {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    messaging = getMessaging(app);

    // Global foreground handler
    onMessage(messaging, (payload) => {      
      if (Notification.permission === 'granted') {
        const title = payload.notification?.title || payload.data?.title || "Habitflow Update";
        const body = payload.notification?.body || payload.data?.body || "You have a new notification!";
        
        // Force the system banner to appear
        new Notification(title, {
          body: body,
          icon: '/icon.png',
        });
      }
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { messaging, onMessage, register, onRegistered, getToken };