import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-wrapper";

// Custom hook that automatically includes auth tokens in mutations
export function useAuthenticatedMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables, token: string | null) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const token = isSignedIn ? await getToken?.() : null;
      return mutationFn(variables, token);
    },
    ...options,
  });
}