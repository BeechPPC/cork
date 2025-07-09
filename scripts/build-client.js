import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create output directory
const outputDir = resolve(__dirname, '../dist/public');
mkdirSync(outputDir, { recursive: true });

// Copy static assets
console.log('📁 Copying static assets...');
cpSync(resolve(__dirname, '../client/public'), outputDir, { recursive: true });
cpSync(
  resolve(__dirname, '../client/index.html'),
  resolve(outputDir, 'index.html')
);

// Debug: Log all environment variables to see what's available
console.log('🔍 All environment variables:', Object.keys(process.env));
console.log(
  '🔍 Environment variables found:',
  Object.keys(process.env).filter(key => key.startsWith('VITE_'))
);

// Create a temporary .env file for the build
const envContent = Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .map(key => `${key}=${process.env[key]}`)
  .join('\n');

if (envContent) {
  writeFileSync(resolve(__dirname, '../.env'), envContent);
  console.log('📝 Created temporary .env file with Vite variables');
  console.log('📝 .env content:', envContent);
} else {
  console.log('⚠️ No VITE_* environment variables found');
}

// Collect all VITE_* env vars from process.env
const viteEnv = Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .reduce((acc, key) => {
    acc[`import.meta.env.${key}`] = JSON.stringify(process.env[key]);
    return acc;
  }, {});

console.log('🔍 Vite env vars to inject:', Object.keys(viteEnv));

// Check for specific Firebase variables
const firebaseVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

firebaseVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`🔍 ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  if (value) {
    console.log(`   Value: ${value.substring(0, 10)}...`);
  }
});

// Add standard env vars
viteEnv['process.env.NODE_ENV'] = '"production"';
viteEnv['import.meta.env.NODE_ENV'] = '"production"';
viteEnv['import.meta.env.PROD'] = 'true';
viteEnv['import.meta.env.DEV'] = 'false';

// If no environment variables are found, create a fallback config
if (Object.keys(viteEnv).length === 0) {
  console.log('⚠️ No environment variables found, creating fallback config');

  // Create a simple config that will prevent the app from crashing
  viteEnv['import.meta.env.VITE_FIREBASE_API_KEY'] = '"MISSING_API_KEY"';
  viteEnv['import.meta.env.VITE_FIREBASE_AUTH_DOMAIN'] =
    '"MISSING_AUTH_DOMAIN"';
  viteEnv['import.meta.env.VITE_FIREBASE_PROJECT_ID'] = '"MISSING_PROJECT_ID"';
  viteEnv['import.meta.env.VITE_FIREBASE_STORAGE_BUCKET'] =
    '"MISSING_STORAGE_BUCKET"';
  viteEnv['import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID'] =
    '"MISSING_SENDER_ID"';
  viteEnv['import.meta.env.VITE_FIREBASE_APP_ID'] = '"MISSING_APP_ID"';
}

try {
  // Build with esbuild
  await build({
    entryPoints: [resolve(__dirname, '../client/src/main.tsx')],
    bundle: true,
    outfile: resolve(outputDir, 'main.js'),
    format: 'esm',
    target: 'es2020',
    jsx: 'automatic',
    minify: true,
    define: viteEnv,
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': resolve(__dirname, '../client/src'),
      '@shared': resolve(__dirname, '../shared'),
      '@assets': resolve(__dirname, '../attached_assets'),
    },
  });

  // Update HTML to reference the built JS file
  console.log('📝 Updating HTML...');
  let html = readFileSync(resolve(outputDir, 'index.html'), 'utf8');
  html = html.replace('/src/main.tsx', '/main.js');
  writeFileSync(resolve(outputDir, 'index.html'), html);

  console.log('✅ Client build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
