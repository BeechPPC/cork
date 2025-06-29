import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { storage } from './storage.js';
import { registerRoutes } from './routes.js';
import { setupVite, serveStatic, log } from './vite.js';

console.log('🚀 Server starting up...');
console.log('📋 Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
});

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('🔧 Registering routes...');
    const server = await registerRoutes(app);
    console.log('✅ Routes registered successfully');

    // Use standardized error handler
    console.log('🔧 Setting up error handler...');
    const { standardErrorHandler } = await import('./errorHandler.js');
    app.use(standardErrorHandler);
    console.log('✅ Error handler set up');

    // Skip Vite setup in production/serverless environments
    if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
      console.log('🔧 Setting up Vite for development...');
      try {
        await setupVite(app, server);
        console.log('✅ Vite setup complete');
      } catch (error) {
        console.warn('⚠️ Vite setup failed, serving static files:', error);
        serveStatic(app);
      }
    } else {
      console.log('🔧 Setting up static file serving for production...');
      serveStatic(app);
      console.log('✅ Static file serving set up');
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = process.env.PORT || 5000;
    console.log(`🚀 Starting server on port ${port}...`);

    server.listen(
      {
        port,
        host: '0.0.0.0',
      },
      () => {
        log(`✅ Server running on port ${port}`);
        console.log(`✅ Server is ready to handle requests`);
      }
    );

    // Add error handling for the server
    server.on('error', error => {
      console.error('❌ Server error:', error);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
