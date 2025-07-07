import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

// Copy source files
console.log('📁 Copying source files...');
cpSync(resolve(__dirname, '../client/src'), resolve(outputDir, 'src'), {
  recursive: true,
});

// Create environment variables file
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

writeFileSync(resolve(outputDir, 'env.js'), envScript);

// Update HTML to include environment variables
console.log('📝 Updating HTML...');
let html = readFileSync(resolve(outputDir, 'index.html'), 'utf8');
html = html.replace('</head>', `<script src="/env.js"></script></head>`);
writeFileSync(resolve(outputDir, 'index.html'), html);

console.log('✅ Build completed successfully!');
