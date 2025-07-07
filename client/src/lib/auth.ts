import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  subscriptionPlan?: 'free' | 'premium';
  usage?: {
    savedWines: number;
    uploadedWines: number;
  };
}

export function convertFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    firstName: firebaseUser.displayName?.split(' ')[0] || null,
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || null,
    profileImageUrl: firebaseUser.photoURL,
    createdAt: firebaseUser.metadata.creationTime || undefined,
    updatedAt: firebaseUser.metadata.lastSignInTime || undefined,
    subscriptionPlan: 'free',
    usage: {
      savedWines: 0,
      uploadedWines: 0,
    },
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<UserCredential> {
  console.log('🔍 signUp: Starting account creation...');

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  console.log('🔍 signUp: Account created, credential user:', {
    uid: credential.user.uid,
    email: credential.user.email,
  });

  // Update profile with name if provided
  if (firstName || lastName) {
    console.log('🔍 signUp: Updating profile with name...');
    await updateProfile(credential.user, {
      displayName: `${firstName || ''} ${lastName || ''}`.trim(),
    });
    console.log('🔍 signUp: Profile updated successfully');
  }

  // Check auth state immediately after creation
  console.log('🔍 signUp: Checking auth state after creation...');
  console.log('🔍 signUp: auth.currentUser:', auth.currentUser?.uid);
  console.log('🔍 signUp: credential.user:', credential.user.uid);
  console.log(
    '🔍 signUp: Are they the same?',
    auth.currentUser?.uid === credential.user.uid
  );

  return credential;
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  console.log('🔍 onAuthStateChange: Setting up Firebase auth listener');

  // Set up the Firebase auth state listener
  const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
    console.log('🔍 onAuthStateChange: Firebase auth state changed:', {
      firebaseUser: firebaseUser?.uid,
      email: firebaseUser?.email,
      timestamp: new Date().toISOString(),
    });

    const user = firebaseUser ? convertFirebaseUser(firebaseUser) : null;
    console.log('🔍 onAuthStateChange: Converted user:', user);

    callback(user);
  });

  console.log(
    '🔍 onAuthStateChange: Listener set up, returning unsubscribe function'
  );
  return unsubscribe;
}

export function isFirebaseConfigured(): boolean {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
  ];

  return requiredEnvVars.every(varName => import.meta.env[varName]);
}

export function testFirebaseAuth(): void {
  console.log('🔍 testFirebaseAuth: Testing Firebase auth functionality');
  console.log('🔍 testFirebaseAuth: auth object:', auth);
  console.log('🔍 testFirebaseAuth: auth.currentUser:', auth.currentUser);
  console.log(
    '🔍 testFirebaseAuth: auth.onAuthStateChanged function:',
    typeof auth.onAuthStateChanged
  );

  // Check if this is a mock auth object
  const isMockAuth =
    !auth.onAuthStateChanged || typeof auth.onAuthStateChanged !== 'function';
  console.log('🔍 testFirebaseAuth: Is mock auth object:', isMockAuth);

  if (isMockAuth) {
    console.warn(
      '🔍 testFirebaseAuth: Using mock auth object - Firebase Auth not properly configured'
    );
  }

  // Test the onAuthStateChanged function directly
  try {
    console.log('🔍 testFirebaseAuth: Testing onAuthStateChanged function...');
    const testUnsubscribe = auth.onAuthStateChanged(user => {
      console.log(
        '🔍 testFirebaseAuth: Test listener fired with user:',
        user?.uid
      );
    });
    console.log('🔍 testFirebaseAuth: Test listener set up successfully');
    // Clean up the test listener
    setTimeout(() => {
      testUnsubscribe();
      console.log('🔍 testFirebaseAuth: Test listener cleaned up');
    }, 100);
  } catch (error) {
    console.error(
      '🔍 testFirebaseAuth: Error testing onAuthStateChanged:',
      error
    );
  }

  // Check if we can access Firebase auth methods
  console.log('🔍 testFirebaseAuth: Checking Firebase auth methods...');
  console.log(
    '🔍 testFirebaseAuth: auth.signInWithEmailAndPassword:',
    typeof auth.signInWithEmailAndPassword
  );
  console.log(
    '🔍 testFirebaseAuth: auth.createUserWithEmailAndPassword:',
    typeof auth.createUserWithEmailAndPassword
  );
  console.log('🔍 testFirebaseAuth: auth.signOut:', typeof auth.signOut);

  // Check if we're in a browser environment
  console.log('🔍 testFirebaseAuth: Browser environment check:', {
    window: typeof window !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
  });
}

export function getCurrentAuthState(): AuthUser | null {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.log('🔍 getCurrentAuthState: No current user');
    return null;
  }

  const user = convertFirebaseUser(currentUser);
  console.log('🔍 getCurrentAuthState: Current user found:', user);
  return user;
}
