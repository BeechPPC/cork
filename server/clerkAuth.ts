import { clerkMiddleware, getAuth } from '@clerk/backend'
import type { Express, RequestHandler } from "express";

// Check if Clerk is configured
const isClerkConfigured = process.env.CLERK_SECRET_KEY && 
  process.env.CLERK_SECRET_KEY !== 'sk_test_placeholder_clerk_secret_key_for_development';

if (!isClerkConfigured) {
  console.warn('Clerk not configured - authentication will be limited');
}

export function setupClerkAuth(app: Express) {
  if (isClerkConfigured) {
    // Apply Clerk middleware to all routes
    app.use(clerkMiddleware());
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!isClerkConfigured) {
    return res.status(503).json({ message: "Authentication not configured" });
  }

  const auth = getAuth(req);
  const { userId } = auth;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Add userId to request for easy access
  req.userId = userId;
  next();
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}