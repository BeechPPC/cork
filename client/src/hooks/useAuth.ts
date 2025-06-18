import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Testing mode: Enable premium features for evaluation
  const testUser = user ? {
    ...user,
    subscriptionPlan: 'premium' // Premium testing mode active
  } : user;

  return {
    user: testUser,
    isLoading,
    isAuthenticated: !!user,
  };
}
