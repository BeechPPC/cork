import { ReactNode, createContext, useContext } from 'react';
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

function ClerkAuthWrapper({ children }: AuthWrapperProps) {
  try {
    // Only import and use Clerk hooks when we know ClerkProvider exists
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
  } catch (error) {
    console.error("ClerkAuthWrapper error:", error);
    // Fallback to disabled auth if Clerk hooks fail
    return <DisabledAuthWrapper>{children}</DisabledAuthWrapper>;
  }
}

function DisabledAuthWrapper({ children }: AuthWrapperProps) {
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
    return <ClerkAuthWrapper>{children}</ClerkAuthWrapper>;
  } else {
    return <DisabledAuthWrapper>{children}</DisabledAuthWrapper>;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}