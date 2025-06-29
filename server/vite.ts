import express, { type Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { createServer as createViteServer, createLogger } from 'vite';
import { type Server } from 'http';
import viteConfig from '../vite.config.js';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = 'express') {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        if (process.env.NODE_ENV === 'development') {
          process.exit(1);
        }
        // In production, log the error but keep the server running
      },
    },
    server: serverOptions,
    appType: 'custom',
  });

  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        '..',
        'client',
        'index.html'
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, 'utf-8');
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible build locations
  const possiblePaths = [
    path.resolve(__dirname, 'public'),
    path.resolve(__dirname, '..', 'dist'),
    path.resolve(__dirname, '..', 'dist', 'public'),
    path.resolve(__dirname, '..', 'client', 'dist'),
  ];

  let distPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      console.log(`Found static files at: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    console.warn(
      'Could not find build directory, serving development fallback'
    );
    // In production, we should have built files, but let's not crash
    app.use('*', (_req, res) => {
      res.status(404).json({
        message: "Application not built. Please run 'npm run build' first.",
        error: 'Build files not found',
      });
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use('*', (_req, res) => {
    res.sendFile(path.resolve(distPath!, 'index.html'));
  });
}
