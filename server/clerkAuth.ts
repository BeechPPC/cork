import { clerkMiddleware, createRouteMatcher } from '@clerk/backend'
import type { Express, RequestHandler } from "express";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Environment variable CLERK_SECRET_KEY not provided");
}

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/api/auth/user',
  '/api/save-wine',
  '/api/remove-saved-wine',
  '/api/upload-wine',
  '/api/analyze-meal-pairing',
  '/api/profile/setup',
  '/api/create-subscription',
  '/api/get-or-create-subscription',
  '/api/saved-wines',
  '/api/uploaded-wines',
  '/api/wine-menu-analysis'
]);

export function setupClerkAuth(app: Express) {
  // Apply Clerk middleware to all routes
  app.use(clerkMiddleware());
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const { userId } = req.auth || {};
  
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