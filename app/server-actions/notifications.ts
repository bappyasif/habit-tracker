// Inside your Next.js hook or component after getting the token
export const registerOrUpdateFcmTokenWithBackend = async (fcmToken: string, authToken: string) => {
  try {
    // 0.0.0.0:8000 will throw an CORS error
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

const secureRequest = async (url: string, data: any, authToken: string, method: string) => {
  if (!authToken) {
    console.error('Auth token not found');
    return;
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.error('Failed to send push notifications');
      // throw new Error('Failed to send push notifications');
    }
    return response.json();
  } catch (error) {
    console.error('Network error sending push notifications:', error);
  }
};

export const sendPushNotificationsToUserWhenCompletedHabitSteps = async (authToken: string) => {
  const url = 'http://localhost:8000/api/v1/notifications/daily-habit-step-completion-securely'

  return secureRequest(url, {}, authToken, 'POST')
}

export const sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay = async (authToken: string, title: string, body: string) => {
  const url = 'http://localhost:8000/api/v1/notifications/habit-daily-total-steps-completion-securely'

  return secureRequest(url, { message_title: title, message_body: body }, authToken, 'POST')

  // try {

  //   if (!authToken) {
  //     console.error('Auth token not found');
  //     return;
  //   }

  //   const url = 'http://localhost:8000/api/v1/notifications/push-to-user-device-securely'

  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + authToken
  //     },
  //     body: JSON.stringify({
  //       message_title: title,
  //       message_body: body,
  //     }),
  //   });

  //   if (!response.ok) {
  //     console.error('Failed to send push notifications');
  //     // throw new Error('Failed to send push notifications');
  //   }
    
  //   return response.json();

  // } catch (error) {
  //   console.error('Network error sending push notifications:', error);
  // }
}

export const fetchNotificationsFromBackend = async (authToken: string) => {
  // const url = 'http://localhost:8000/api/v1/notifications/tray-list-securely'

  // return secureRequest(url, {}, authToken, 'GET')

  try {
    if (!authToken) {
      console.error('Auth token not found');
      return;
    }

    const url = 'http://localhost:8000/api/v1/notifications/tray-list-securely'

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch notifications');
      throw new Error('Failed to fetch notifications');
    }
    
    return response.json();

  } catch (error) {
    console.error('Network error fetching notifications:', error);
  }
}