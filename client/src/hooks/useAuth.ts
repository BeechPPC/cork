import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { isClerkConfigured } from "@/lib/clerk";

export function useAuth() {
  const clerkHook = isClerkConfigured ? useUser() : { user: null, isLoaded: true };
  const { user: clerkUser, isLoaded: clerkLoaded } = clerkHook;
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!clerkUser && clerkLoaded && isClerkConfigured,
  });

  return {
    user,
    clerkUser,
    isLoading: isClerkConfigured ? (!clerkLoaded || userLoading) : false,
    isAuthenticated: isClerkConfigured ? (!!clerkUser && !!user) : false,
  };
}
