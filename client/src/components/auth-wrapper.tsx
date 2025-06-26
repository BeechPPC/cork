import { ReactNode, useState, useEffect, useRef } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from "@/lib/clerk";

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

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!isClerkConfigured) {
    // Return consistent state for unconfigured Clerk
    if (authState.isLoading) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isSignedIn: false,
        isLoaded: true,
        getToken: async () => null,
      });
    }
    return authState;
  }

  try {
    // Use Clerk hooks when configured and inside ClerkProvider
    const clerkAuth = useClerkAuth();
    const { user } = useUser();
    
    // Create state signature to detect changes
    const currentStateSignature = `${clerkAuth.isLoaded}-${clerkAuth.isSignedIn}-${!!user}-${user?.id || ''}`;
    
    // Only update state if it has actually changed and component is still mounted
    if (currentStateSignature !== lastStateRef.current && mountedRef.current) {
      const newAuthState = {
        user,
        isLoading: !clerkAuth.isLoaded,
        isAuthenticated: clerkAuth.isSignedIn || false,
        isSignedIn: clerkAuth.isSignedIn || false,
        isLoaded: clerkAuth.isLoaded || false,
        getToken: clerkAuth.getToken || (async () => null),
      };
      
      setAuthState(newAuthState);
      lastStateRef.current = currentStateSignature;
      
      // Log state changes for debugging
      if (clerkAuth.isLoaded) {
        console.log("Auth state updated:", {
          isSignedIn: clerkAuth.isSignedIn,
          hasUser: !!user,
          userId: user?.id
        });
      }
    }
    
    return authState;
  } catch (error) {
    console.error("Clerk auth error:", error);
    
    // Return safe fallback state
    const fallbackState = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
      getToken: async () => null,
    };
    
    if (mountedRef.current && JSON.stringify(authState) !== JSON.stringify(fallbackState)) {
      setAuthState(fallbackState);
    }
    
    return fallbackState;
  }
}

// Simple wrapper that just renders children
export function AuthWrapper({ children }: AuthWrapperProps) {
  return <>{children}</>;
}