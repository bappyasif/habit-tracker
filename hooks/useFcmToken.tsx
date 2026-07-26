'use client';

import { useEffect, useState } from 'react';
import { messaging, onMessage, onRegistered, register } from '@/lib/firebase';
import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';
// Import 'register' and 'onRegistered' instead of 'getToken'

export default function useFcmToken() {
  const [installationId, setInstallationId] = useState<string | null>(null);
  const {state: authState} = useUserAuthCtx()
  const authToken = authState?.user?.token

  useEffect(() => {
    if (!authToken) return;
    if (!installationId) return;
    registerOrUpdateFcmTokenWithBackend(installationId, authToken);
  }, [installationId, authToken]);

  useEffect(() => {
    if (!messaging) return;

    // 1. Listen for the registration ID when it's generated/updated
    const unsubscribeToken = onRegistered(messaging, (id) => {
      console.log('Firebase Installation ID (FID):', id);
      console.log("auth token: ", authToken, authState)
      
      setInstallationId(id);
      
      // TODO: Send this 'id' to your Python/SQLAlchemy backend instead of the old FCM token
      if(!authToken) {
        alert("No auth token found, login first")
        return
      }

      registerOrUpdateFcmTokenWithBackend(id, authToken);
    });

    // 2. Handle foreground messages
    const unsubscribeMessage = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      alert(`Notification: ${payload.notification?.title}`);
    });

    return () => {
      unsubscribeToken();
      unsubscribeMessage();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && messaging) {
        
        // Register the service worker first
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }

        // 3. Trigger the registration flow using the modern API with your VAPID key
        await register(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return { installationId, requestPermission };
}