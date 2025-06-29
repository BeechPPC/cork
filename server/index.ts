import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { storage } from './storage.js';

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

// Try to add the auth user endpoint with Clerk
app.get('/api/auth/user', async (req: any, res) => {
  try {
    console.log('=== /api/auth/user endpoint called ===');

    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('❌ Clerk not configured');
      return res.status(503).json({ message: 'Authentication not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return res.status(401).json({ message: 'No valid authorization token' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token verification - Token length:', token.length);

    try {
      const verifiedToken = await clerkClient.verifyToken(token);
      const userId = verifiedToken.sub;
      console.log('✅ Token verification - Success, userId:', userId);

      // Try to get user from database
      console.log('🔍 Fetching user from database for userId:', userId);
      let user = await storage.getUser(userId);
      console.log('📊 User from database:', user ? 'Found' : 'Not found');

      if (!user) {
        console.log(
          '🆕 User not found in database, creating new user:',
          userId
        );
        try {
          // Get user info from Clerk
          const clerkUser = await clerkClient.users.getUser(userId);
          console.log('📋 Clerk user data:', {
            email: clerkUser.emailAddresses?.[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
          });

          const userData = {
            id: userId,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            profileImageUrl: clerkUser.imageUrl || '',
            subscriptionPlan: 'free', // Default to free plan
          };

          user = await storage.upsertUser(userData);
          console.log('✅ Created new user:', user);
        } catch (createError) {
          console.error('❌ Failed to create user:', createError);
          return res.status(500).json({ message: 'Failed to create user' });
        }
      }

      console.log('📋 Final user data:', {
        id: user.id,
        email: user.email,
        profileCompleted: user.profileCompleted,
        dateOfBirth: user.dateOfBirth,
      });

      res.json({
        ...user,
        usage: {
          savedWines: 0,
          uploadedWines: 0,
        },
      });
    } catch (authError) {
      console.error('❌ Token verification failed:', authError);
      return res.status(401).json({ message: 'Invalid token' });
    }
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
