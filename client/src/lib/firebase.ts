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
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'MISSING_API_KEY')
  missingFields.push('apiKey');
if (
  !firebaseConfig.authDomain ||
  firebaseConfig.authDomain === 'MISSING_AUTH_DOMAIN'
)
  missingFields.push('authDomain');
if (
  !firebaseConfig.projectId ||
  firebaseConfig.projectId === 'MISSING_PROJECT_ID'
)
  missingFields.push('projectId');
if (
  !firebaseConfig.storageBucket ||
  firebaseConfig.storageBucket === 'MISSING_STORAGE_BUCKET'
)
  missingFields.push('storageBucket');
if (
  !firebaseConfig.messagingSenderId ||
  firebaseConfig.messagingSenderId === 'MISSING_SENDER_ID'
)
  missingFields.push('messagingSenderId');
if (!firebaseConfig.appId || firebaseConfig.appId === 'MISSING_APP_ID')
  missingFields.push('appId');

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase config fields:', missingFields);

  // Show a user-friendly error message
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f44336;
    color: white;
    padding: 20px;
    text-align: center;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;
  errorDiv.innerHTML = `
    <h3>Configuration Error</h3>
    <p>Firebase configuration is missing. Please check your environment variables.</p>
    <p>Missing: ${missingFields.join(', ')}</p>
  `;
  document.body.appendChild(errorDiv);

  // Create a mock auth object to prevent the app from crashing
  const mockAuth = {
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

  export { mockAuth as auth };
  export default null;
} else {
  // Initialize Firebase with error handling
  let app;
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    console.log('✅ Firebase app initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }

  // Initialize Firebase Auth with detailed error handling
  let auth;
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
      const testUnsubscribe = auth.onAuthStateChanged(user => {
        console.log('🔍 Test auth listener fired with user:', user?.uid);
      });
      console.log('✅ Test auth listener set up successfully');
      // Clean up test listener after 1 second
      setTimeout(() => {
        testUnsubscribe();
        console.log('🔍 Test auth listener cleaned up');
      }, 1000);
    } catch (error) {
      console.error('❌ Error testing onAuthStateChanged:', error);
    }

    // Set persistence to LOCAL to ensure auth state persists
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('✅ Firebase Auth persistence set to LOCAL');
      })
      .catch(error => {
        console.error('❌ Failed to set Firebase Auth persistence:', error);
      });
  } catch (error) {
    console.error('❌ Firebase Auth initialization failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Provide specific guidance based on error code
    if (error.code === 'auth/invalid-api-key') {
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

  export { auth };
  export default app;
}
