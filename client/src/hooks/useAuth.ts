import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!clerkUser && clerkLoaded,
  });

  return {
    user,
    clerkUser,
    isLoading: !clerkLoaded || userLoading,
    isAuthenticated: !!clerkUser && !!user,
  };
}
