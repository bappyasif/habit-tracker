'use client';

import { useEffect, useState } from 'react';
import { messaging, onMessage, onRegistered, register } from '@/lib/firebase';
import { useUserAuthCtx } from '@/context-reducers/userAuthCtx';
import { registerOrUpdateFcmTokenWithBackend } from '@/app/server-actions/notifications';
// Import 'register' and 'onRegistered' instead of 'getToken'

export default function useFcmToken() {
  const [installationId, setInstallationId] = useState<string | null>(null);
  const { state: authState } = useUserAuthCtx();
  const authToken = authState?.user?.token;

  // 1. Listen for Firebase registration ID
  useEffect(() => {
    if (!messaging) return;

    const unsubscribeToken = onRegistered(messaging, (id) => {
      console.log('Firebase Installation ID (FID):', id);
      setInstallationId(id);
    });

    const unsubscribeMessage = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      alert(`Notification: ${payload.notification?.title}`);
    });

    return () => {
      unsubscribeToken();
      unsubscribeMessage();
    };
  }, []);

  // 2. NEW: Automatically sync with backend as soon as BOTH token and authToken are present
  useEffect(() => {
    if (installationId && authToken) {
      console.log('Syncing FCM token with backend...');
      registerOrUpdateFcmTokenWithBackend(installationId, authToken).then((data) => {
        console.log('FCM token synced with backend.');
        console.log(data);
      }).catch((error) => {
        console.error('Error syncing FCM token with backend:', error);
      });
    }
  }, [installationId, authToken]);

  const requestPermission = async () => {
    // FIX: Check for auth token BEFORE letting them click or proceed
    if (!authToken) {
      alert("Please wait for authentication to load or log in first.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && messaging) {
        
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }

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