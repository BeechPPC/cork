import { auth } from '@/lib/firebase';

// Custom API request function that includes auth tokens
export async function apiRequestWithAuth(
  method: string,
  url: string,
  data?: any
): Promise<Response> {
  // Get the current user and their token
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No authenticated user found');
  }

  const token = await currentUser.getIdToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response;
}
