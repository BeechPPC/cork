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
    define: {
      'process.env.NODE_ENV': '"production"',
      'import.meta.env.NODE_ENV': '"production"',
      'import.meta.env.PROD': 'true',
      'import.meta.env.DEV': 'false',
    },
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
