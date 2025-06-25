import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-wrapper";

// Custom hook that automatically includes auth tokens in queries
export function useAuthenticatedQuery<TData = unknown, TError = Error>(
  queryKey: readonly unknown[],
  queryFn: (token: string | null) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const token = isSignedIn ? await getToken?.() : null;
      return queryFn(token);
    },
    enabled: isSignedIn && (options?.enabled !== false),
    ...options,
  });
}