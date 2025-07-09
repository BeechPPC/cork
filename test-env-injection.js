import { readFileSync } from 'fs';

// Read the built main.js file
const mainJs = readFileSync('./dist/public/main.js', 'utf8');

// Check if VITE_FIREBASE_API_KEY is properly injected
if (mainJs.includes('VITE_FIREBASE_API_KEY')) {
  console.log('❌ VITE_FIREBASE_API_KEY is still in the code (not replaced)');
} else if (mainJs.includes('import.meta.env.VITE_FIREBASE_API_KEY')) {
  console.log(
    '❌ import.meta.env.VITE_FIREBASE_API_KEY is still in the code (not replaced)'
  );
} else {
  console.log('✅ VITE_FIREBASE_API_KEY appears to be properly injected');
}

// Check for other environment variables
const envVars = [
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

envVars.forEach(envVar => {
  if (mainJs.includes(envVar)) {
    console.log(`❌ ${envVar} is still in the code (not replaced)`);
  } else {
    console.log(`✅ ${envVar} appears to be properly injected`);
  }
});

console.log('🔍 Sample of main.js content:');
console.log(mainJs.substring(0, 500));
