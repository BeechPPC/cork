import type { Express, Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      });
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
    }
  } else {
    console.warn(
      '⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found - using default credentials'
    );
    try {
      initializeApp();
      console.log('✅ Firebase Admin initialized with default credentials');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
    }
  }
}

// Firebase auth middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No valid authorization token provided',
      error: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split('Bearer ')[1];

  getAuth()
    .verifyIdToken(token)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      console.error('Token verification failed:', error);
      return res.status(401).json({
        message: 'Invalid or expired token',
        error: 'INVALID_TOKEN',
      });
    });
}

// Setup function (kept for compatibility)
export function setupClerkAuth(app: Express) {
  console.log('🔧 Setting up Firebase auth middleware');
  // Firebase auth is handled by the requireAuth middleware
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return getApps().length > 0;
}
