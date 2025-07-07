import { useState, useEffect } from 'react';
import {
  onAuthStateChange,
  getAuthToken,
  AuthUser,
  isFirebaseConfigured,
} from '@/lib/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
}

export function useFirebaseAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isSignedIn: false,
    isLoaded: false,
    getToken: async () => null,
  });

  // Set up auth state listener
  useEffect(() => {
    console.log('🔍 useFirebaseAuth: Starting auth state setup');
    console.log(
      '🔍 useFirebaseAuth: isFirebaseConfigured() =',
      isFirebaseConfigured()
    );

    if (!isFirebaseConfigured()) {
      console.log(
        '🔍 useFirebaseAuth: Firebase not configured, setting loaded state immediately'
      );
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isSignedIn: false,
        isLoaded: true,
        getToken: async () => null,
      });
      return;
    }

    console.log('🔍 useFirebaseAuth: Setting up Firebase auth listener...');

    const unsubscribe = onAuthStateChange(user => {
      console.log('🔍 useFirebaseAuth: Firebase auth state changed:', {
        user: user?.id,
        isAuthenticated: !!user,
        timestamp: new Date().toISOString(),
      });

      const currentState = {
        user,
        isLoading: false,
        isAuthenticated: !!user,
        isSignedIn: !!user,
        isLoaded: true,
        getToken: getAuthToken,
      };

      console.log('🔍 useFirebaseAuth: Setting new auth state:', currentState);
      setAuthState(currentState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log('🔍 useFirebaseAuth: Current state:', authState);
  return authState;
}
