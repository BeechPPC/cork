import { ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from "@/lib/clerk";

interface AuthWrapperProps {
  children: ReactNode;
}

// Export auth hook that conditionally uses Clerk
export function useAuth() {
  if (!isClerkConfigured) {
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
    
    console.log("Clerk Auth State:", {
      isSignedIn: clerkAuth.isSignedIn,
      isLoaded: clerkAuth.isLoaded,
      hasUser: !!user,
      userId: user?.id
    });
    
    return {
      user,
      isLoading: !clerkAuth.isLoaded,
      isAuthenticated: clerkAuth.isSignedIn || false,
      isSignedIn: clerkAuth.isSignedIn || false,
      isLoaded: clerkAuth.isLoaded || false,
      getToken: clerkAuth.getToken,
    };
  } catch (error) {
    console.error("Clerk auth error:", error);
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
      getToken: async () => null,
    };
  }
}

// Simple wrapper that just renders children
export function AuthWrapper({ children }: AuthWrapperProps) {
  return <>{children}</>;
}