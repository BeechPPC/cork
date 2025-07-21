import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Vite build process...');

// Run Vite build
try {
  console.log('📦 Running Vite build...');
  execSync('npx vite build', {
    stdio: 'inherit',
    cwd: resolve(__dirname, '..'),
  });
  console.log('✅ Vite build completed successfully!');
} catch (error) {
  console.error('❌ Vite build failed:', error.message);
  process.exit(1);
}

// Create environment variables file for production
console.log('🔧 Creating environment variables...');
const envVars = {
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || '',
  NODE_ENV: 'production',
};

const envScript = `
window.import = window.import || {};
window.import.meta = window.import.meta || {};
window.import.meta.env = ${JSON.stringify(envVars, null, 2)};
`;

const outputDir = resolve(__dirname, '../dist/public');
writeFileSync(resolve(outputDir, 'env.js'), envScript);

// Update HTML to include environment variables
console.log('📝 Updating HTML with environment variables...');
let html = readFileSync(resolve(outputDir, 'index.html'), 'utf8');
html = html.replace('</head>', `<script src="/env.js"></script></head>`);
writeFileSync(resolve(outputDir, 'index.html'), html);

console.log('✅ Build process completed successfully!');
console.log('📁 Output directory:', outputDir);
