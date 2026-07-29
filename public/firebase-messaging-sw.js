// public/firebase-messaging-sw.js
/**
 * 
 * The public/ folder is meant for raw, static assets (like images, favicons, and plain scripts) that Next.js serves "as-is" without touching[2]. Because the service worker runs in a separate browser background thread outside of your React application bundle, it expects a raw .js file
 * you can optionally include ts into ur public folder by updating .json file after installing esbuild with scripts including {..."build": "esbuild src/firebase-messaging-sw.ts --bundle --outfile=public/firebase-messaging-sw.js && next build"}
 */

// 1. MUST use the '-compat' script versions for service workers
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// 2. Initialize Firebase with your actual config values (hardcoded, since workers can't read process.env)
firebase.initializeApp({
  apiKey: "AIzaSyAmsJrLeeQkVUFlyu4bMFsiXFVSTXOULYk",
  authDomain: "habitflow-developed-by-abappy.firebaseapp.com",
  projectId: "habitflow-developed-by-abappy",
  storageBucket: "habitflow-developed-by-abappy.firebasestorage.app",
  messagingSenderId: "830002484684",
  appId: "1:830002484684:web:2f1ccb4a719ac6c181f969",
});

const messaging = firebase.messaging();

// Required to force Chrome/Firefox to register a functional fetch/push handler type
// testing in the browser
// self.addEventListener('fetch', (event) => {
//   // Necessary pass-through to satisfy browser service worker requirements
//   event.respondWith(fetch(event.request));
//   console.log('Service Worker: Fetch event for:', event.request.url);
// });

// 3. Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});