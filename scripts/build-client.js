import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Build with Vite
  await build({
    configFile: resolve(__dirname, '../vite.config.ts'),
    root: resolve(__dirname, '../client'),
    build: {
      outDir: resolve(__dirname, '../dist/public'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, '../client/index.html'),
      },
    },
  });

  console.log('✅ Client build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
