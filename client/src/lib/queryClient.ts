import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { getAuthToken } from '@/lib/auth';

// Extend Window interface to include Firebase (for backward compatibility)
declare global {
  interface Window {
    Firebase?: {
      auth?: {
        currentUser?: {
          getIdToken(): Promise<string | null>;
        };
      };
    };
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  token?: string | null
): Promise<Response> {
  // Get the Firebase token if available and not provided
  let authToken: string | null = token;
  if (!authToken) {
    try {
      // Try to get token from Firebase
      authToken = await getAuthToken();
      console.log(
        'API Request - Token retrieved:',
        authToken ? 'Token exists' : 'No token'
      );
    } catch (error) {
      console.warn('Could not get Firebase token:', error);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    console.log('API Request - Authorization header added');
  } else {
    console.log('API Request - No authorization header (no token)');
  }

  console.log('API Request - Making request to:', url, 'with method:', method);

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  console.log('API Request - Response status:', res.status);

  await throwIfResNotOk(res);
  return res;
}

// Helper function for authenticated requests
export async function authenticatedApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  // Get token from Firebase auth
  let token: string | null = null;
  try {
    token = await getAuthToken();
  } catch (error) {
    console.warn('Could not get auth token:', error);
  }

  return apiRequest(method, url, data, token);
}

type UnauthorizedBehavior = 'returnNull' | 'throw';
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  token?: string | null;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, token }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;

    // Check if this is an authenticated endpoint
    const isAuthenticatedEndpoint =
      url.includes('/api/auth/') ||
      url.includes('/api/cellar') ||
      url.includes('/api/uploads') ||
      url.includes('/api/profile');

    let authToken = token;

    // Get token for authenticated endpoints
    if (isAuthenticatedEndpoint && !authToken) {
      try {
        authToken = await getAuthToken();
        console.log(
          'Query - Token retrieved for',
          url,
          authToken ? 'Token exists' : 'No token'
        );
      } catch (error) {
        console.warn('Could not get auth token for query:', error);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('Query - Authorization header added for', url);
    } else if (isAuthenticatedEndpoint) {
      console.log(
        'Query - No authorization header for authenticated endpoint:',
        url
      );
    }

    const res = await fetch(url, {
      credentials: 'include',
      headers,
    });

    if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
