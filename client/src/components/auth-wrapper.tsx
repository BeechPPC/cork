import { ReactNode, createContext, useContext } from 'react';
import { isClerkConfigured } from "@/lib/clerk";

// Create a consistent auth context
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

function ClerkAuthContent({ children }: AuthWrapperProps) {
  const { useAuth: useClerkAuth, useUser } = require("@clerk/clerk-react");
  const clerkAuth = useClerkAuth();
  const { user } = useUser();
  
  const authValue: AuthContextType = {
    user,
    isLoading: !clerkAuth.isLoaded,
    isAuthenticated: clerkAuth.isSignedIn || false,
    isSignedIn: clerkAuth.isSignedIn || false,
    isLoaded: clerkAuth.isLoaded || false,
    getToken: clerkAuth.getToken,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

function DisabledAuthContent({ children }: AuthWrapperProps) {
  const authValue: AuthContextType = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    isSignedIn: false,
    isLoaded: true,
    getToken: async () => null,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  if (isClerkConfigured) {
    return <ClerkAuthContent>{children}</ClerkAuthContent>;
  } else {
    return <DisabledAuthContent>{children}</DisabledAuthContent>;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}