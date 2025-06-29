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

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test route registration step by step
app.get('/api/test-routes', async (req, res) => {
  try {
    console.log('🔧 Testing route registration...');

    // Test 1: Import registerRoutes
    console.log('Step 1: Importing registerRoutes...');
    const { registerRoutes } = await import('./routes.js');
    console.log('✅ registerRoutes imported successfully');

    // Test 2: Import error handler
    console.log('Step 2: Importing error handler...');
    const { standardErrorHandler } = await import('./errorHandler.js');
    console.log('✅ Error handler imported successfully');

    // Test 3: Import Vite utilities
    console.log('Step 3: Importing Vite utilities...');
    const { setupVite, serveStatic, log } = await import('./vite.js');
    console.log('✅ Vite utilities imported successfully');

    res.json({
      message: 'All imports successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Import test failed:', error);
    res.status(500).json({
      message: 'Import test failed',
      error: error.message,
      stack: error.stack,
    });
  }
});

// Serve static files
app.use(express.static('dist'));

// Fallback to index.html
app.use('*', (_req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: '404',
  });
});

const port = process.env.PORT || 5000;
console.log(`🚀 Starting server on port ${port}...`);

const server = createServer(app);

server.listen(
  {
    port,
    host: '0.0.0.0',
  },
  () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`✅ Server is ready to handle requests`);
  }
);

// Add error handling for the server
server.on('error', error => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  console.error('❌ Stack trace:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
