import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import { createServer } from 'http';

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

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Try to add the auth user endpoint
app.get('/api/auth/user', async (req: any, res) => {
  try {
    console.log('=== /api/auth/user endpoint called ===');

    // For now, just return a simple response to test if the endpoint works
    res.json({
      message: 'Auth user endpoint is working',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error in /api/auth/user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
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
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
