const getBackendUrl = () => {
  // const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return backendUrl;
}

const getLocallyStoredEmailNotificationsPermission = () => {
  const emailNotificationsPermission = localStorage.getItem('emailNotifications');
  return emailNotificationsPermission;
}

// we could do something similar getLocallyStoredEmailNotificationsPermission for authToken, if thats needed and secured to do so.

export const registerOrUpdateFcmTokenWithBackend = async (fcmToken: string, authToken: string) => {
  try {
    // 0.0.0.0:8000 will throw an CORS error
    const url = getBackendUrl() + '/api/v1/notifications/fcm-token-save-or-update-securely'

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

export const sendPushNotificationsToUserWhenCreatedNewHabit = async (authToken: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/created-new-habit-securely'

  return secureRequest(url, {}, authToken, 'POST')
}

export const sendPushNotificationsToUserWhenUpdatedHabit = async (authToken: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/updated-habit-securely'

  return secureRequest(url, {}, authToken, 'PUT')
}

export const sendPushNotificationsToUserWhenDeletedHabit = async (authToken: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/deleted-habit-securely'

  getLocallyStoredEmailNotificationsPermission()

  return secureRequest(url, {}, authToken, 'DELETE')
}

export const sendPushNotificationsToUserWhenCompletedHabitSteps = async (authToken: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/daily-habit-step-completion-securely'

  return secureRequest(url, {}, authToken, 'POST')
}

export const sendPushNotificationsToUserWhenUpdatedHabitSteps = async (authToken: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/daily-habit-step-updates-securely'

  return secureRequest(url, {}, authToken, 'POST')
}

export const updatePushNotificationIsRead = async (authToken: string, notificationId: number) => {
  const url = getBackendUrl() + '/api/v1/notifications/mark-notification-as-read-securely/' + notificationId

  return secureRequest(url, {}, authToken, 'PUT')
}

export const sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay = async (authToken: string, title: string, body: string) => {
  const url = getBackendUrl() + '/api/v1/notifications/habit-daily-total-steps-completion-securely'

  return secureRequest(url, { message_title: title, message_body: body }, authToken, 'POST')
}

export const fetchNotificationsFromBackend = async (authToken: string) => {
  try {
    if (!authToken) {
      console.error('Auth token not found');
      return;
    }

    const url = getBackendUrl() + '/api/v1/notifications/tray-list-securely'

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