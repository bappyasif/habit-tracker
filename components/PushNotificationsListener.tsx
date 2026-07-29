'use client';
import useFcmToken from '@/hooks/useFcmToken';

export function PushNotificationsListener() {
  // This initializes the foreground listener globally without causing re-render loops
  useFcmToken();
  return null; // Renders nothing visually
}