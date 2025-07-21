import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

// Debug: Check if environment variables are loaded
console.log('Firebase config check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    ? '✅ Set'
    : '❌ Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
    ? '✅ Set'
    : '❌ Missing',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    ? '✅ Set'
    : '❌ Missing',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
});

// Debug: Show actual values (first few characters only for security)
console.log('Firebase environment variables:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY
    ? `${import.meta.env.VITE_FIREBASE_API_KEY.substring(0, 10)}...`
    : 'undefined',
  VITE_FIREBASE_AUTH_DOMAIN:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'undefined',
  VITE_FIREBASE_PROJECT_ID:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'undefined',
  VITE_FIREBASE_STORAGE_BUCKET:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'undefined',
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'undefined',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || 'undefined',
});

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Declare variables at the top level
let app: any;
let auth: any;

// Debug: Log the actual config (without sensitive data)
console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey
    ? `${firebaseConfig.apiKey.substring(0, 10)}...`
    : 'undefined',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Check if any required fields are missing
const missingFields = [];
if (!firebaseConfig.apiKey) missingFields.push('apiKey');
if (!firebaseConfig.authDomain) missingFields.push('authDomain');
if (!firebaseConfig.projectId) missingFields.push('projectId');
if (!firebaseConfig.storageBucket) missingFields.push('storageBucket');
if (!firebaseConfig.messagingSenderId) missingFields.push('messagingSenderId');
if (!firebaseConfig.appId) missingFields.push('appId');

if (missingFields.length > 0) {
  console.warn('⚠️ Missing Firebase config fields:', missingFields);
  console.warn('⚠️ Creating mock Firebase configuration for development');

  // Create a mock Firebase app and auth object
  app = {
    name: '[DEFAULT]',
    options: {},
  };

  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      console.log('Mock auth: onAuthStateChanged called');
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: async () => {
      throw new Error('Firebase Auth not properly configured');
    },
    createUserWithEmailAndPassword: async () => {
      throw new Error('Firebase Auth not properly configured');
    },
    signOut: async () => {
      console.log('Mock auth: signOut called');
    },
  };

  console.log('✅ Mock Firebase configuration created');
} else {
  // Initialize Firebase with error handling
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    console.log('✅ Firebase app initialized successfully');
  } catch (error: any) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    throw error;
  }

  // Initialize Firebase Auth with detailed error handling
  try {
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized successfully');
    console.log('🔍 Firebase Auth object type:', typeof auth);
    console.log(
      '🔍 Firebase Auth has onAuthStateChanged:',
      typeof auth.onAuthStateChanged
    );
    console.log('🔍 Firebase Auth has currentUser:', auth.currentUser);
    console.log('🔍 Firebase Auth object keys:', Object.keys(auth));

    // Test the onAuthStateChanged function immediately
    console.log('🔍 Testing onAuthStateChanged function...');
    try {
      const testUnsubscribe = auth.onAuthStateChanged((user: any) => {
        console.log('🔍 Test auth listener fired with user:', user?.uid);
      });
      console.log('✅ Test auth listener set up successfully');
      // Clean up test listener after 1 second
      setTimeout(() => {
        testUnsubscribe();
        console.log('🔍 Test auth listener cleaned up');
      }, 1000);
    } catch (error: any) {
      console.error('❌ Error testing onAuthStateChanged:', error);
    }

    // Set persistence to LOCAL to ensure auth state persists
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('✅ Firebase Auth persistence set to LOCAL');
      })
      .catch((error: any) => {
        console.error('❌ Failed to set Firebase Auth persistence:', error);
      });
  } catch (error: any) {
    console.error('❌ Firebase Auth initialization failed:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    // Provide specific guidance based on error code
    if (error?.code === 'auth/invalid-api-key') {
      console.error('🔧 Troubleshooting auth/invalid-api-key:');
      console.error('1. Check if the API key is correct in your .env file');
      console.error('2. Verify the Firebase project exists and is active');
      console.error(
        '3. Ensure Authentication is enabled in your Firebase project'
      );
      console.error('4. Check if the API key has the necessary permissions');
      console.error('5. Verify the authDomain matches your Firebase project');

      // Create a mock auth object to prevent the app from crashing
      console.warn('⚠️ Creating mock auth object to prevent app crash');
      auth = {
        currentUser: null,
        onAuthStateChanged: (callback: any) => {
          console.log('Mock auth: onAuthStateChanged called');
          callback(null);
          return () => {};
        },
        signInWithEmailAndPassword: async () => {
          throw new Error('Firebase Auth not properly configured');
        },
        createUserWithEmailAndPassword: async () => {
          throw new Error('Firebase Auth not properly configured');
        },
        signOut: async () => {
          console.log('Mock auth: signOut called');
        },
      };
    } else {
      throw error;
    }
  }
}

export { auth };

export default app;
