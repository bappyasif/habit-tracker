'use client';

import { useState } from 'react';
import { messaging, getToken } from '@/lib/firebase';
import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';

export default function useFcmToken() {
  const [token, setToken] = useState<string | null>(null);
  const { state: authState } = useUserAuthCtx();
  const authToken = authState?.user?.token;

  // Request permission, register service worker, and grab the FCM token string
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

          // Send token immediately to your Python FastAPI backend
          if (currentToken) {
            console.log("Sending token to backend for current user:", currentToken);
            const response = await registerOrUpdateFcmTokenWithBackend(currentToken, authToken);
            console.log("Backend sync result:", response);
          }
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

  return { token, requestPermission };
}