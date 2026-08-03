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

// Initialize Firebase only on the client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// 🔥 GLOBAL FOREGROUND LISTENER (Runs once on app load, NEVER unmounts)
if (typeof window !== 'undefined' && messaging) {
  onMessage(messaging, (payload) => {
    console.log('🔥 GLOBAL FOREGROUND PAYLOAD RECEIVED:', payload);
    
    if (Notification.permission === 'granted') {
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "Habitflow update!";
      new Notification(title, { body, icon: '/icon.png' });
    }
  });
}

export { messaging, onMessage, register, onRegistered, getToken };