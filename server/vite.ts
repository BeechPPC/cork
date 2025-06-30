import express, { type Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { type Server } from 'http';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Only load Vite in development
  if (process.env.NODE_ENV !== 'development') {
    console.log('Vite setup skipped in production');
    return;
  }

  try {
    const { createServer: createViteServer, createLogger } = await import(
      'vite'
    );
    const viteConfig = await import('../vite.config.js');

    const viteLogger = createLogger();

    const serverOptions = {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true as true,
    };

    const vite = await createViteServer({
      ...viteConfig.default,
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
  } catch (error) {
    console.error('Failed to setup Vite:', error);
    // Fall back to static serving
    serveStatic(app);
  }
}

export function serveStatic(app: Express) {
  // In production, the build files are in dist/public
  // In development, they might be in server/public
  const distPath =
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '..', 'dist', 'public')
      : path.resolve(__dirname, 'public');

  if (!fs.existsSync(distPath)) {
    console.error(`Build directory not found: ${distPath}`);
    console.error(
      'Available directories:',
      fs.readdirSync(path.resolve(__dirname, '..'))
    );
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}
