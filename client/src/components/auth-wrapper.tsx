import { ReactNode, createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";

// Create a consistent auth context that works with or without Clerk
interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken?: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isSignedIn: false,
  isLoaded: true,
});

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  let authValue: AuthContextType;

  if (isClerkConfigured) {
    // Use Clerk hooks when properly configured
    const clerkAuth = useClerkAuth();
    const { user } = useUser();
    
    authValue = {
      user,
      isLoading: !clerkAuth.isLoaded,
      isAuthenticated: clerkAuth.isSignedIn || false,
      isSignedIn: clerkAuth.isSignedIn || false,
      isLoaded: clerkAuth.isLoaded || false,
      getToken: clerkAuth.getToken,
    };
  } else {
    // Provide disabled state when Clerk is not configured
    authValue = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
      getToken: async () => null,
    };
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}