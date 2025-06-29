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
