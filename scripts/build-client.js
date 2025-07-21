import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables
const envFile = resolve(__dirname, '../.env');
let envVars = {};

try {
  const envContent = readFileSync(envFile, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && key.startsWith('VITE_')) {
      envVars[key] = value.trim();
    }
  });
} catch (error) {
  console.log('No .env file found, using process.env');
  // Use process.env as fallback
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      envVars[key] = process.env[key];
    }
  });
}

// Create define object for esbuild
const define = {
  'process.env.NODE_ENV': '"production"',
  'import.meta.env.NODE_ENV': '"production"',
  'import.meta.env.PROD': 'true',
  'import.meta.env.DEV': 'false',
};

// Add Vite environment variables
Object.keys(envVars).forEach(key => {
  define[`import.meta.env.${key}`] = JSON.stringify(envVars[key]);
});

try {
  await build({
    entryPoints: [resolve(__dirname, '../client/src/main.tsx')],
    bundle: true,
    outfile: resolve(__dirname, '../dist/public/main.js'),
    format: 'esm',
    target: 'es2020',
    jsx: 'automatic',
    minify: true,
    define,
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': resolve(__dirname, '../client/src'),
      '@shared': resolve(__dirname, '../shared'),
      '@assets': resolve(__dirname, '../attached_assets'),
    },
  });

  console.log('✅ Client build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
