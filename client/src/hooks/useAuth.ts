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

  // Only import Clerk hooks when configured
  try {
    const { useAuth: useClerkAuth, useUser } = require("@clerk/clerk-react");
    const clerkAuth = useClerkAuth();
    const { user } = useUser();

    return {
      user,
      isLoading: !clerkAuth.isLoaded,
      isAuthenticated: clerkAuth.isSignedIn,
      isSignedIn: clerkAuth.isSignedIn,
      isLoaded: clerkAuth.isLoaded,
    };
  } catch (error) {
    // Fallback if Clerk is not available
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isSignedIn: false,
      isLoaded: true,
    };
  }
}
