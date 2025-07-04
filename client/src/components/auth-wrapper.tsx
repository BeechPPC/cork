import { ReactNode, useState, useEffect, useRef } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from '@/lib/clerk';

interface AuthWrapperProps {
  children: ReactNode;
}

interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
}

// Export auth hook that conditionally uses Clerk
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isSignedIn: false,
    isLoaded: false,
    getToken: async () => null,
  });

  const mountedRef = useRef(true);
  const lastStateRef = useRef<string>('');
  const [clerkError, setClerkError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isClerkConfigured && authState.isLoading) {
      const timeout = setTimeout(() => {
        if (mountedRef.current && authState.isLoading) {
          console.warn('Clerk loading timeout - forcing loaded state');
          setClerkError('Clerk initialization timed out');
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isSignedIn: false,
            isLoaded: true,
            getToken: async () => null,
          });
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isClerkConfigured, authState.isLoading]);

  console.log(
    'useAuth called - isClerkConfigured:',
    isClerkConfigured,
    'clerkError:',
    clerkError
  );

  if (!isClerkConfigured) {
    // Return consistent state for unconfigured Clerk
    if (authState.isLoading) {
      console.log('Clerk not configured - setting loaded state');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isSignedIn: false,
        isLoaded: true,
        getToken: async () => null,
      });
    }
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
      getToken: async () => null,
    };
  }

  try {
    // Use Clerk hooks when configured and inside ClerkProvider
    const clerkAuth = useClerkAuth();
    const { user } = useUser();

    console.log('Clerk auth state:', {
      isLoaded: clerkAuth.isLoaded,
      isSignedIn: clerkAuth.isSignedIn,
      hasUser: !!user,
      error: clerkError,
      userId: user?.id,
    });

    // If Clerk is loaded, return the current state immediately
    if (clerkAuth.isLoaded) {
      const currentState = {
        user,
        isLoading: false,
        isAuthenticated: clerkAuth.isSignedIn || false,
        isSignedIn: clerkAuth.isSignedIn || false,
        isLoaded: true,
        getToken: clerkAuth.getToken || (async () => null),
      };

      // Update state if it's different
      if (JSON.stringify(currentState) !== JSON.stringify(authState)) {
        console.log('Updating auth state:', currentState);
        setAuthState(currentState);
      }

      // Clear error if Clerk loads successfully
      if (clerkError) {
        setClerkError(null);
      }

      // Log state changes for debugging
      console.log('Auth state updated:', {
        isSignedIn: clerkAuth.isSignedIn,
        hasUser: !!user,
        userId: user?.id,
        isLoaded: true,
      });

      return currentState; // Return current state immediately
    }

    // If Clerk is not loaded yet, return the current auth state
    return authState;
  } catch (error) {
    console.error('Clerk auth error:', error);
    setClerkError(error.message);

    // Return safe fallback state
    const fallbackState = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
      getToken: async () => null,
    };

    if (
      mountedRef.current &&
      JSON.stringify(authState) !== JSON.stringify(fallbackState)
    ) {
      console.log('Setting fallback auth state due to error');
      setAuthState(fallbackState);
    }

    return fallbackState;
  }
}

// Simple wrapper that just renders children
export function AuthWrapper({ children }: AuthWrapperProps) {
  return <>{children}</>;
}
