import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user } = useUser();

  if (!isClerkConfigured) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
    };
  }

  return {
    user,
    isLoading: !clerkAuth.isLoaded,
    isAuthenticated: clerkAuth.isSignedIn,
    isSignedIn: clerkAuth.isSignedIn,
    isLoaded: clerkAuth.isLoaded,
  };
}
