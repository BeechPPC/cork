import { useEffect, useState } from 'react';
import { useAuth } from '@/components/firebase-auth/AuthWrapper';
import { getCurrentUser, isFirebaseConfigured } from '@/lib/auth';

export function FirebaseDiagnostic() {
  const { isSignedIn, user, isLoaded, isLoading } = useAuth();
  const [directUser, setDirectUser] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const checkDirectUser = () => {
      const currentUser = getCurrentUser();
      setDirectUser(currentUser);
      setLastUpdate(new Date());
    };

    // Check immediately
    checkDirectUser();

    // Check every second
    const interval = setInterval(checkDirectUser, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isFirebaseConfigured()) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Firebase Not Configured</strong>
        <br />
        Missing environment variables
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-sm">
      <strong>Firebase Auth Diagnostic</strong>
      <br />
      <div className="text-xs mt-2">
        <div>Hook State:</div>
        <div>• isLoaded: {isLoaded ? '✅' : '❌'}</div>
        <div>• isLoading: {isLoading ? '🔄' : '⏸️'}</div>
        <div>• isSignedIn: {isSignedIn ? '✅' : '❌'}</div>
        <div>• user: {user?.id || 'null'}</div>
        <div className="mt-2">Direct Firebase:</div>
        <div>• currentUser: {directUser?.uid || 'null'}</div>
        <div>• email: {directUser?.email || 'null'}</div>
        <div className="mt-2 text-gray-500">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
