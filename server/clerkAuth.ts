import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import type { Express, RequestHandler } from "express";

// Check if Clerk is configured
const isClerkConfigured = process.env.CLERK_SECRET_KEY && 
  process.env.CLERK_SECRET_KEY !== 'sk_test_placeholder_clerk_secret_key_for_development';

if (!isClerkConfigured) {
  console.warn('Clerk not configured - authentication will be limited');
}

export function setupClerkAuth(app: Express) {
  // Clerk setup is handled per-route basis with ClerkExpressRequireAuth
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!isClerkConfigured) {
    return res.status(503).json({ message: "Authentication not configured" });
  }

  // Use Clerk's Express middleware
  const clerkMiddleware = ClerkExpressRequireAuth();
  clerkMiddleware(req, res, (err) => {
    if (err) {
      console.error("Clerk auth error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Add userId to request for easy access
    if (req.auth?.userId) {
      req.userId = req.auth.userId;
      console.log("Auth middleware - userId set:", req.userId);
    } else {
      console.log("Auth middleware - no userId found in req.auth");
    }
    
    next();
  });
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth?: {
        userId?: string;
      };
    }
  }
}