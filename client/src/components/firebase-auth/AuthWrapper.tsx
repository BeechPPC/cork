import { ReactNode } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface AuthWrapperProps {
  children: ReactNode;
}

// Auth wrapper that provides Firebase authentication state
export function AuthWrapper({ children }: AuthWrapperProps) {
  // Use the Firebase auth hook to get authentication state
  const authState = useFirebaseAuth();

  // Render children with auth state available
  return <>{children}</>;
}

// Export the auth hook for consistency
export { useFirebaseAuth as useAuth };
