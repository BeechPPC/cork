import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";

export function useAuth() {
  // Return disabled state for non-Clerk environments
  if (!isClerkConfigured) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
    };
  }

  // Use Clerk hooks directly when configured
  const clerkAuth = useClerkAuth();
  const { user } = useUser();

  return {
    user,
    isLoading: !clerkAuth.isLoaded,
    isAuthenticated: clerkAuth.isSignedIn,
    isSignedIn: clerkAuth.isSignedIn,
    isLoaded: clerkAuth.isLoaded,
  };
}
