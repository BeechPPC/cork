import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Temporarily enable premium for testing
  const testUser = user ? {
    ...user,
    subscriptionPlan: 'premium' // Override to premium for testing
  } : user;

  return {
    user: testUser,
    isLoading,
    isAuthenticated: !!user,
  };
}
