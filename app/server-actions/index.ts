const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return backendUrl;
}

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
      console.log('Failed to send user reuqest');
      // throw new Error('Failed to send push notifications');
    }
    return response.json();
  } catch (error) {
    console.error('Network error sending user request:', error);
  }
};

export const sendRequestToDeleteUserAccount = async (authToken: string) => {
    const url = getBackendUrl() + '/api/v1/settings/delete-user-account-securely';

    return secureRequest(url, {}, authToken, 'DELETE')
}