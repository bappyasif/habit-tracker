'use client';

import { useEffect, useState } from 'react';
import { messaging, onMessage, getToken } from '@/lib/firebase';
import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';

export default function useFcmToken() {
  const [token, setToken] = useState<string | null>(null);
  const { state: authState } = useUserAuthCtx();
  const authToken = authState?.user?.token;

  // 1. Listen for incoming messages while the app is actively open in the browser
  // useEffect(() => {
  //   if (!messaging) return;

  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("🔥 FULL FOREGROUND PAYLOAD RECEIVED:", JSON.stringify(payload));
      
  //     // // Force a manual system notification pop-up when the app tab is focused
  //     // if (Notification.permission === 'granted') {
  //     //   new Notification(payload.notification?.title || 'New Notification', {
  //     //     body: payload.notification?.body || '',
  //     //     icon: '/icon.png',
  //     //   });
  //     // }

  //     // 🛠️ FORCE BROWSER TO SHOW POPUP WHEN APP IS OPEN
  //   if (Notification.permission === 'granted') {
  //     const title = payload.notification?.title || payload.data?.title || "New Notification";
  //     const body = payload.notification?.body || payload.data?.body || "Habitflow update!";
      
  //     new Notification(title, {
  //       body: body,
  //       icon: '/icon.png',
  //     });
  //   }

  //   });

  //   return () => unsubscribe();
  // }, []);

  // taking this out of react router tree entirely as a singleton pattern outside react components
//   useEffect(() => {
//   console.log("🔌 useFcmToken useEffect mounted. Messaging instance:", messaging);

//   if (!messaging) {
//     console.warn("⚠️ Messaging is null! onMessage listener skipped.");
//     return;
//   }

//   console.log("✅ Setting up foreground onMessage listener...");

//   const unsubscribe = onMessage(messaging, (payload) => {
//     console.log("🔥 FULL FOREGROUND PAYLOAD RECEIVED:", JSON.stringify(payload));
    
//     if (Notification.permission === 'granted') {
//       const title = payload.notification?.title || "New Notification";
//       const body = payload.notification?.body || "Habitflow update!";
//       new Notification(title, { body, icon: '/icon.png' });
//     }
//   });

//   return () => {
//     console.log("🔌 Cleaning up onMessage listener.");
//     unsubscribe();
//   };
// }, []);

  // 2. Request permission, register service worker, and grab the FCM token string
  const requestPermission = async () => {
    if (!authToken) {
      alert("Please wait for authentication to load or log in first.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && messaging) {
        
        // Register the service worker explicitly from the public directory
        let swRegistration: ServiceWorkerRegistration | undefined;
        if ('serviceWorker' in navigator) {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully:', swRegistration);
        }

        // Retrieve the FCM token (bypassing the TS deprecation warning safely)
        // // @ts-expect-error - getToken is required for web push token retrieval
        // @ts-ignore
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: swRegistration,
        });

        if (currentToken) {
          console.log('FCM Token generated successfully:', currentToken);
          setToken(currentToken);

          // 3. Send token immediately to your Python FastAPI backend
          // const response = await registerOrUpdateFcmTokenWithBackend(currentToken, authToken);
          if (currentToken) {
            console.log("Sending token to backend for current user:", currentToken);
            const response = await registerOrUpdateFcmTokenWithBackend(currentToken, authToken);
            console.log("Backend sync result:", response);
          }
          // console.log('Backend token sync response:', response);
        } else {
          console.log('No FCM registration token available.');
        }

      } else {
        console.log('Notification permission denied by user.');
      }
    } catch (error) {
      console.error('Error generating token or registering service worker:', error);
    }
  };

  // inside useFcmToken.tsx where you call registerOrUpdateFcmTokenWithBackend
  

  return { token, requestPermission };
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { messaging, onMessage,  } from '@/lib/firebase';
// import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
// import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';

// export default function useFcmToken() {
//   const [token, setToken] = useState<string | null>(null);
//   const { state: authState } = useUserAuthCtx();
//   const authToken = authState?.user?.token;

//   // Handle foreground messages when the app is open
//   useEffect(() => {
//     if (!messaging) return;

//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Foreground message received in React:', payload);
      
//       // Force a manual browser popup alert when the app is focused
//       if (Notification.permission === 'granted') {
//         new Notification(payload.notification?.title || 'New Notification', {
//           body: payload.notification?.body || '',
//           icon: '/icon.png',
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const requestPermission = async () => {
//     if (!authToken) {
//       alert("Please wait for authentication to load or log in first.");
//       return;
//     }

//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === 'granted' && messaging) {
        
//         // 1. Explicitly register your service worker from public folder
//         let swRegistration: ServiceWorkerRegistration | undefined;
//         if ('serviceWorker' in navigator) {
//           swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//           console.log('Service Worker registered:', swRegistration);
//         }

//         // 2. Fetch the FCM token directly
//         // @ts-expect-error - bypass deprecated warning
//         const currentToken = await getToken(messaging, {
//           vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//           serviceWorkerRegistration: swRegistration,
//         });

//         if (currentToken) {
//           console.log('FCM Token generated successfully:', currentToken);
//           setToken(currentToken);

//           // 3. Immediately send token to your Python/SQLAlchemy backend
//           const response = await registerOrUpdateFcmTokenWithBackend(currentToken, authToken);
//           console.log('Backend sync response:', response);
//         } else {
//           console.log('No FCM registration token available.');
//         }

//       } else {
//         console.log('Notification permission denied by user.');
//       }
//     } catch (error) {
//       console.error('Error generating token or registering service worker:', error);
//     }
//   };

//   return { token, requestPermission };
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { messaging, onMessage, onRegistered, register } from '@/lib/firebase';
// import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
// import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';
// // Import 'register' and 'onRegistered' instead of 'getToken'

// export default function useFcmToken() {
//   const [installationId, setInstallationId] = useState<string | null>(null);
//   const { state: authState } = useUserAuthCtx();
//   const authToken = authState?.user?.token;

//   // 1. Listen for Firebase registration ID
//   useEffect(() => {
//     if (!messaging) return;

//     const unsubscribeToken = onRegistered(messaging, (id) => {
//       console.log('Firebase Installation ID (FID):', id);
//       setInstallationId(id);
//     });

//     const unsubscribeMessage = onMessage(messaging, (payload) => {
//       console.log('Foreground message received:', payload);
//       alert(`Notification: ${payload.notification?.title}`);

//       // Trigger a visual browser notification manually when the app is focused!
//     if (Notification.permission === 'granted') {
//       new Notification(payload.notification?.title || 'New Notification', {
//         body: payload.notification?.body || '',
//         icon: '/icon.png',
//       });
//     }
//     });

//     return () => {
//       unsubscribeToken();
//       unsubscribeMessage();
//     };
//   }, []);

//   // 2. NEW: Automatically sync with backend as soon as BOTH token and authToken are present
//   useEffect(() => {
//     if (installationId && authToken) {
//       console.log('Syncing FCM token with backend...');
//       registerOrUpdateFcmTokenWithBackend(installationId, authToken).then((data) => {
//         console.log('FCM token synced with backend.');
//         console.log(data);
//       }).catch((error) => {
//         console.error('Error syncing FCM token with backend:', error);
//       });
//     }
//   }, [installationId, authToken]);

//   const requestPermission = async () => {
//     // FIX: Check for auth token BEFORE letting them click or proceed
//     if (!authToken) {
//       alert("Please wait for authentication to load or log in first.");
//       return;
//     }

//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === 'granted' && messaging) {
        
//         if ('serviceWorker' in navigator) {
//           await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//         }

//         await register(messaging, {
//           vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//         });

//       } else {
//         console.log('Notification permission denied.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//     }
//   };

//   return { installationId, requestPermission };
// }