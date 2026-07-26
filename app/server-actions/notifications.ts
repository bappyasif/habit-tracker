// Inside your Next.js hook or component after getting the token
export const registerOrUpdateFcmTokenWithBackend = async (fcmToken: string, authToken: string) => {
  try {
    // 0.0.0.0:8000 will throw an CORS error
    // const url = 'http://0.0.0.0:8000/api/v1/notifications/fcm-token-save-or-update-securely'
    const url = 'http://localhost:8000/api/v1/notifications/fcm-token-save-or-update-securely'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      
      body: JSON.stringify({
        fcm_token: fcmToken,
        device_type: navigator.userAgent, // automatically grabs browser info
      }),
    });

    if (!response.ok) {
      console.error('Failed to save FCM token to server');
      throw new Error('Failed to save FCM token to server');
    }
    
    return response.json();

  } catch (error) {
    console.error('Network error saving FCM token:', error);
  }
};