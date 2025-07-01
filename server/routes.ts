import type { Express } from 'express';
import express from 'express';
import { createServer, type Server } from 'http';
import { storage } from './storage.js';
import { setupClerkAuth, requireAuth, isClerkConfigured } from './clerkAuth.js';
import { setupClerkWebhooks } from './clerkWebhooks.js';
import {
  getWineRecommendations,
  analyseWineImage,
  analyzeMealPairing,
  searchAustralianWineries,
  analyzeWineMenu,
} from './openai.js';
import {
  insertSavedWineSchema,
  insertUploadedWineSchema,
  insertRecommendationHistorySchema,
} from '../shared/schema.js';
import { sendEmailSignupConfirmation } from './emailService.js';
import { db } from './db.js';
import Stripe from 'stripe';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    'STRIPE_SECRET_KEY not found - Stripe features will be disabled'
  );
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
  : null;

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    message: 'Too many requests from this IP, please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Stricter limit for auth endpoints
  message: {
    message: 'Too many authentication attempts, please try again later.',
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit file uploads per hour
  message: {
    message: 'Too many file uploads, please try again later.',
    error: 'UPLOAD_RATE_LIMIT_EXCEEDED',
  },
});

const emailSignupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Maximum 5 email signups per hour per IP
  message: {
    message: 'Too many signup attempts, please try again later.',
    error: 'SIGNUP_RATE_LIMIT_EXCEEDED',
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Starting server routes registration');

  // Apply general rate limiting to all API routes
  app.use('/api/', generalLimiter);

  // Multer error handling middleware for file upload errors
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File too large. Maximum size is 10MB.',
          error: 'FILE_TOO_LARGE',
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          message: 'Too many files. Only one file allowed.',
          error: 'TOO_MANY_FILES',
        });
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: 'Unexpected file field.',
          error: 'UNEXPECTED_FILE',
        });
      }
      return res.status(400).json({
        message: 'File upload error: ' + error.message,
        error: 'UPLOAD_ERROR',
      });
    }

    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        message: 'Only image files are allowed (JPG, PNG, WebP).',
        error: 'INVALID_FILE_TYPE',
      });
    }

    next(error);
  });

  // Add simple health check first
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Test recommendations endpoint for debugging
  app.post('/api/test-recommendations', (req, res) => {
    try {
      const { query } = req.body;
      console.log('Test recommendations query:', query);

      res.json({
        recommendations: [
          {
            name: 'Test Wine 1',
            type: 'Test Type',
            region: 'Test Region',
            vintage: '2024',
            description: 'Test description',
            priceRange: '$20-30',
            abv: '13.0%',
            rating: '90/100',
            matchReason: 'Test match reason',
          },
        ],
        timestamp: new Date().toISOString(),
        source: 'test_endpoint',
        query: query,
      });
    } catch (error) {
      console.error('Test recommendations error:', error);
      res.status(500).json({
        message: 'Test recommendations failed',
        error: error.message,
      });
    }
  });

  // Auth middleware
  setupClerkAuth(app);

  // Clerk webhooks (must be before body parser middleware)
  setupClerkWebhooks(app);

  // Winery search route (placed early to avoid middleware conflicts)
  app.post('/api/search-wineries', async (req, res) => {
    try {
      console.log('Winery search request received:', req.body);
      res.setHeader('Content-Type', 'application/json');

      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const wineries = await searchAustralianWineries(query);
      console.log('Winery search results:', wineries.length, 'wineries found');

      return res.status(200).json({ wineries });
    } catch (error: any) {
      console.error('Winery search error:', error);
      return res.status(500).json({ message: 'Failed to search wineries' });
    }
  });

  // Auth routes - serverless compatible
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      console.log(
        'Token verification - Received auth header:',
        authHeader ? 'Present' : 'Missing'
      );
      console.log('Token verification - Token length:', token.length);

      try {
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
        console.log('Token verification - Success, userId:', userId);
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'User ID not found in token' });
      }

      let user = await storage.getUser(userId);

      // If user doesn't exist, create them automatically
      if (!user) {
        console.log('User not found in database, creating new user:', userId);
        try {
          // Get user info from Clerk
          const clerkUser = await clerkClient.users.getUser(userId);

          const userData = {
            id: userId,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            profileImageUrl: clerkUser.imageUrl || '',
            subscriptionPlan: 'free', // Default to free plan
          };

          user = await storage.upsertUser(userData);
          console.log('Created new user:', user);
        } catch (createError) {
          console.error('Failed to create user:', createError);
          return res.status(500).json({ message: 'Failed to create user' });
        }
      }

      // Get usage counts for plan limits (optimized single query)
      const userCounts = await storage.getUserCounts(userId);

      res.json({
        ...user,
        usage: {
          savedWines: userCounts.savedWines,
          uploadedWines: userCounts.uploadedWines,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Meal pairing analysis endpoint (Premium feature) - serverless compatible
  app.post(
    '/api/analyze-meal-pairing',
    uploadLimiter,
    upload.single('image'),
    async (req: any, res) => {
      try {
        if (!isClerkConfigured) {
          return res
            .status(503)
            .json({ message: 'Authentication not configured' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res
            .status(401)
            .json({ message: 'No valid authorization token' });
        }

        const token = authHeader.replace('Bearer ', '');
        let userId: string;

        try {
          const verifiedToken = await clerkClient.verifyToken(token);
          userId = verifiedToken.sub;
        } catch (authError) {
          console.error('Token verification failed:', authError);
          return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has premium access
        if (user.subscriptionPlan !== 'premium') {
          return res.status(403).json({
            message: 'Premium feature required',
            upgrade: true,
          });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'No image file provided' });
        }

        const analysisType = req.body.analysisType as 'meal' | 'menu';
        if (!analysisType || !['meal', 'menu'].includes(analysisType)) {
          return res.status(400).json({ message: 'Invalid analysis type' });
        }

        // Convert image to base64
        const base64Image = req.file.buffer.toString('base64');

        // Import and analyze meal/menu
        const { analyzeMealPairing } = await import('./openai');
        const result = await analyzeMealPairing(base64Image, analysisType);

        res.json(result);
      } catch (error) {
        console.error('Meal pairing analysis error:', error);
        res.status(500).json({ message: 'Analysis failed' });
      }
    }
  );

  // Wine menu analysis
  app.post(
    '/api/analyze-wine-menu',
    uploadLimiter,
    upload.single('image'),
    async (req: any, res) => {
      try {
        const userId = req.userId;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is premium for this feature
        if (user.subscriptionPlan !== 'premium') {
          return res.status(403).json({
            message: 'Premium feature required',
            upgrade: true,
          });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'Menu image is required' });
        }

        const { question } = req.body;
        if (!question || typeof question !== 'string' || !question.trim()) {
          return res
            .status(400)
            .json({ message: 'Question about the menu is required' });
        }

        const base64Image = req.file.buffer.toString('base64');
        const analysis = await analyzeWineMenu(base64Image, question.trim());

        res.json({ analysis });
      } catch (error) {
        console.error('Wine menu analysis error:', error);
        res.status(500).json({ message: 'Analysis failed' });
      }
    }
  );

  // Wine recommendations - AI-powered through Express server
  app.post('/api/recommendations', async (req: any, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query is required' });
      }

      console.log('Processing wine recommendation query:', query);

      // Get AI-powered recommendations
      let recommendations;
      try {
        recommendations = await getWineRecommendations(query);
        console.log(
          'Successfully got AI recommendations:',
          recommendations?.length || 0
        );
      } catch (aiError) {
        console.error('OpenAI recommendation failed:', aiError);

        // Fallback to curated Australian wines if AI fails
        recommendations = [
          {
            name: 'Penfolds Bin 389 Cabernet Shiraz',
            type: 'Cabernet Shiraz',
            region: 'Barossa Valley, SA',
            vintage: '2020',
            description:
              'A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Notes of dark berries, chocolate, and cedar with firm yet approachable tannins.',
            priceRange: '$65-75',
            abv: '14.5%',
            rating: '94/100',
            matchReason:
              "Classic Australian premium red wine showcasing the country's signature Shiraz-Cabernet blend",
          },
          {
            name: 'Wolf Blass Black Label Shiraz',
            type: 'Shiraz',
            region: 'McLaren Vale, SA',
            vintage: '2019',
            description:
              'Rich, full-bodied Shiraz with intense blackberry and plum flavors, complemented by vanilla oak and soft, velvety tannins.',
            priceRange: '$45-55',
            abv: '14.0%',
            rating: '92/100',
            matchReason:
              'Excellent representation of Australian Shiraz craftsmanship from renowned McLaren Vale region',
          },
        ];
      }

      res.json({
        recommendations,
        timestamp: new Date().toISOString(),
        source: 'express_server_ai',
        query: query,
      });
    } catch (error) {
      console.error('Wine recommendations error:', error);
      res.status(500).json({
        message: 'Failed to get recommendations',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  });

  // Save wine to cellar - serverless compatible
  app.post('/api/cellar/save', async (req: any, res) => {
    try {
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      try {
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await storage.getUser(userId);

      // If user doesn't exist, create them automatically
      if (!user) {
        console.log(
          'User not found in database, creating new user for cellar save:',
          userId
        );
        try {
          // Get user info from Clerk
          const clerkUser = await clerkClient.users.getUser(userId);

          const userData = {
            id: userId,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            profileImageUrl: clerkUser.imageUrl || '',
            subscriptionPlan: 'free', // Default to free plan
          };

          await storage.upsertUser(userData);
          console.log('Created new user for cellar save:', userId);
        } catch (createError) {
          console.error('Failed to create user for cellar save:', createError);
          return res.status(500).json({ message: 'Failed to create user' });
        }
      }

      // Check plan limits
      const savedWineCount = await storage.getSavedWineCount(userId);
      if (user.subscriptionPlan === 'free' && savedWineCount >= 3) {
        return res.status(403).json({
          message: 'Plan limit reached',
          planLimit: true,
          currentCount: savedWineCount,
          maxCount: 3,
        });
      }
      const wineData = insertSavedWineSchema.parse({
        userId,
        wineName: req.body.wineName,
        wineType: req.body.wineType,
        source: req.body.source,
      });
      const savedWine = await storage.saveWine(wineData);
      res.json(savedWine);
    } catch (error) {
      console.error('Error saving wine:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Invalid wine data' });
      }
      res.status(500).json({ message: 'Failed to save wine' });
    }
  });

  // Get saved wines - serverless compatible
  app.get('/api/cellar', async (req: any, res) => {
    try {
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      try {
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      const savedWines = await storage.getSavedWines(userId);
      res.json(savedWines);
    } catch (error) {
      console.error('Error fetching saved wines:', error);
      res.status(500).json({ message: 'Failed to fetch saved wines' });
    }
  });

  // Remove wine from cellar - serverless compatible
  app.delete('/api/cellar/:wineId', async (req: any, res) => {
    try {
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      try {
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      const wineId = parseInt(req.params.wineId);
      await storage.removeSavedWine(userId, wineId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing wine:', error);
      res.status(500).json({ message: 'Failed to remove wine' });
    }
  });

  // Wine upload and analysis - serverless compatible
  app.post(
    '/api/upload/analyze',
    upload.single('wine_image'),
    async (req: any, res) => {
      try {
        if (!isClerkConfigured) {
          return res
            .status(503)
            .json({ message: 'Authentication not configured' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res
            .status(401)
            .json({ message: 'No valid authorization token' });
        }

        const token = authHeader.replace('Bearer ', '');
        let userId: string;

        try {
          const verifiedToken = await clerkClient.verifyToken(token);
          userId = verifiedToken.sub;
        } catch (authError) {
          console.error('Token verification failed:', authError);
          return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Check plan limits
        const uploadedWineCount = await storage.getUploadedWineCount(userId);
        if (user.subscriptionPlan === 'free' && uploadedWineCount >= 3) {
          return res.status(403).json({
            message: 'Upload limit reached',
            planLimit: true,
            currentCount: uploadedWineCount,
            maxCount: 3,
          });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'Wine image is required' });
        }

        // Convert image to base64
        const base64Image = req.file.buffer.toString('base64');

        // Analyze with AI
        const analysis = await analyseWineImage(base64Image);

        // Save uploaded wine record
        const uploadedWine = await storage.saveUploadedWine({
          userId,
          originalImageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
          ...analysis,
        });

        res.json(uploadedWine);
      } catch (error) {
        console.error('Error analyzing wine:', error);
        res.status(500).json({ message: 'Failed to analyze wine' });
      }
    }
  );

  // Get uploaded wines - serverless compatible
  app.get('/api/uploads', async (req: any, res) => {
    try {
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      try {
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      const uploadedWines = await storage.getUploadedWines(userId);
      res.json(uploadedWines);
    } catch (error) {
      console.error('Error fetching uploaded wines:', error);
      res.status(500).json({ message: 'Failed to fetch uploaded wines' });
    }
  });

  // Update uploaded wine details
  app.put('/api/uploads/:wineId', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const wineId = parseInt(req.params.wineId);

      if (isNaN(wineId)) {
        return res.status(400).json({ message: 'Invalid wine ID' });
      }

      // Validate the updates - only allow certain fields to be updated
      const allowedFields = [
        'wineName',
        'wineType',
        'region',
        'vintage',
        'optimalDrinkingStart',
        'optimalDrinkingEnd',
        'peakYearsStart',
        'peakYearsEnd',
        'analysis',
        'estimatedValue',
        'abv',
      ];

      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }

      const updatedWine = await storage.updateUploadedWine(
        userId,
        wineId,
        updates
      );
      res.json(updatedWine);
    } catch (error) {
      console.error('Error updating wine:', error);
      res.status(500).json({ message: 'Failed to update wine details' });
    }
  });

  // Subscription management endpoint
  app.post(
    '/api/create-checkout-session',
    requireAuth,
    async (req: any, res) => {
      try {
        const userId = req.userId;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Only check Stripe if user is marked as premium in database
        if (
          user.subscriptionPlan === 'premium' &&
          user.stripeSubscriptionId &&
          stripe
        ) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              user.stripeSubscriptionId
            );
            if (
              subscription.status === 'active' ||
              subscription.status === 'trialing'
            ) {
              return res.json({
                message: 'Already subscribed',
                subscriptionId: subscription.id,
              });
            }
          } catch (error) {
            console.log(
              'Stripe subscription error, allowing new subscription:',
              error
            );
          }
        }

        if (!stripe) {
          return res.status(500).json({ message: 'Stripe not configured' });
        }

        // Create or get Stripe customer
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email || '',
            name: user.firstName || user.lastName || 'Cork User',
            metadata: { userId: user.id },
          });
          customerId = customer.id;
          await storage.updateUserStripeInfo(userId, customerId, null);
        }

        // Get price ID based on plan (default to monthly)
        const plan = req.body.plan || 'monthly';
        const priceId =
          plan === 'yearly'
            ? process.env.STRIPE_YEARLY_PRICE_ID
            : process.env.STRIPE_MONTHLY_PRICE_ID;

        if (!priceId) {
          return res.status(500).json({
            message: `Stripe price ID not configured for ${plan} plan. Please contact support.`,
          });
        }

        // Create Checkout Session with trial
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          subscription_data: {
            trial_period_days: 7,
            metadata: {
              userId: userId,
              plan: plan,
            },
          },
          metadata: {
            userId: userId,
            plan: plan,
          },
          success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}&subscription=success`,
          cancel_url: `${req.headers.origin}/checkout?canceled=true`,
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
          customer_update: {
            address: 'auto',
            name: 'auto',
          },
        });

        console.log('Checkout session created:', {
          sessionId: session.id,
          customerId: customerId,
          priceId: priceId,
          plan: plan,
          stripeMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live')
            ? 'LIVE'
            : 'TEST',
        });

        res.json({
          sessionId: session.id,
          url: session.url,
        });
      } catch (error: any) {
        console.error('Checkout session creation error:', error);

        // Handle specific Stripe errors
        if (
          error.type === 'StripeInvalidRequestError' &&
          error.message?.includes('currency')
        ) {
          res.status(400).json({
            message:
              'This customer already has an active subscription. Please contact support to modify your subscription.',
            hasActiveSubscription: true,
          });
        } else {
          res.status(500).json({
            message: 'Failed to create checkout session: ' + error.message,
          });
        }
      }
    }
  );

  // Get billing information for subscription management
  app.get('/api/billing-info', requireAuth, async (req: any, res) => {
    const user = req.user;
    if (!user.stripeCustomerId || !stripe) {
      return res.json({
        hasStripeData: false,
        invoices: [],
        paymentMethod: null,
        subscription: null,
      });
    }

    try {
      // Get customer billing information
      const customer = (await stripe.customers.retrieve(
        user.stripeCustomerId
      )) as Stripe.Customer;

      // Get invoices
      const invoices = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        limit: 10,
      });

      // Get subscription details
      let subscription: Stripe.Subscription | null = null;
      if (user.stripeSubscriptionId) {
        subscription = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId
        );
      }

      // Get payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      });

      res.json({
        hasStripeData: true,
        customer: {
          email: customer.email,
          name: customer.name,
          address: customer.address,
        },
        invoices: invoices.data.map(invoice => ({
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          period_start: invoice.period_start,
          period_end: invoice.period_end,
        })),
        paymentMethod:
          paymentMethods.data.length > 0
            ? {
                id: paymentMethods.data[0].id,
                brand: paymentMethods.data[0].card?.brand,
                last4: paymentMethods.data[0].card?.last4,
                exp_month: paymentMethods.data[0].card?.exp_month,
                exp_year: paymentMethods.data[0].card?.exp_year,
              }
            : null,
        subscription: subscription
          ? {
              id: subscription.id,
              status: subscription.status,
              current_period_start: (subscription as any).current_period_start,
              current_period_end: (subscription as any).current_period_end,
              cancel_at_period_end: subscription.cancel_at_period_end,
              plan: subscription.items.data[0]?.price.recurring?.interval,
              pause_collection: subscription.pause_collection,
            }
          : null,
      });
    } catch (error: any) {
      console.error('Billing info fetch error:', error);
      res.status(500).json({
        message: 'Failed to fetch billing information: ' + error.message,
      });
    }
  });

  // Update billing address
  app.post(
    '/api/update-billing-address',
    requireAuth,
    async (req: any, res) => {
      const user = req.user;
      if (!user?.stripeCustomerId || !stripe) {
        return res.status(400).json({ message: 'No billing account found' });
      }

      try {
        const { address } = req.body;

        const customer = await stripe.customers.update(user.stripeCustomerId, {
          address: {
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          },
        });

        res.json({ success: true, address: customer.address });
      } catch (error: any) {
        console.error('Billing address update error:', error);
        res.status(500).json({
          message: 'Failed to update billing address: ' + error.message,
        });
      }
    }
  );

  // Create customer portal session for payment method management
  app.post('/api/create-portal-session', requireAuth, async (req: any, res) => {
    const user = req.user;
    if (!user?.stripeCustomerId || !stripe) {
      return res.status(400).json({ message: 'No billing account found' });
    }

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${req.headers.origin}/subscription`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Portal session creation error:', error);
      res
        .status(500)
        .json({ message: 'Failed to create portal session: ' + error.message });
    }
  });

  // Pause subscription
  app.post('/api/pause-subscription', requireAuth, async (req: any, res) => {
    const user = req.user;
    if (!user?.stripeSubscriptionId || !stripe) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      const subscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          pause_collection: {
            behavior: 'mark_uncollectible',
          },
        }
      );

      res.json({
        success: true,
        message: 'Subscription paused successfully',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          pause_collection: subscription.pause_collection,
        },
      });
    } catch (error: any) {
      console.error('Subscription pause error:', error);
      res
        .status(500)
        .json({ message: 'Failed to pause subscription: ' + error.message });
    }
  });

  // Resume subscription
  app.post('/api/resume-subscription', requireAuth, async (req: any, res) => {
    const user = req.user;
    if (!user?.stripeSubscriptionId || !stripe) {
      return res.status(400).json({ message: 'No subscription found' });
    }

    try {
      const subscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          pause_collection: '',
        }
      );

      res.json({
        success: true,
        message: 'Subscription resumed successfully',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          pause_collection: subscription.pause_collection,
        },
      });
    } catch (error: any) {
      console.error('Subscription resume error:', error);
      res
        .status(500)
        .json({ message: 'Failed to resume subscription: ' + error.message });
    }
  });

  // Change subscription plan (monthly/yearly)
  app.post('/api/change-plan', requireAuth, async (req: any, res) => {
    const user = req.user;
    const { newPlan } = req.body; // 'monthly' or 'yearly'

    if (!user?.stripeSubscriptionId || !stripe) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      const currentPriceId = subscription.items.data[0].price.id;

      // Get new price ID
      const newPriceId =
        newPlan === 'yearly'
          ? process.env.STRIPE_YEARLY_PRICE_ID
          : process.env.STRIPE_MONTHLY_PRICE_ID;

      if (!newPriceId) {
        return res
          .status(500)
          .json({ message: `Price ID not configured for ${newPlan} plan` });
      }

      if (currentPriceId === newPriceId) {
        return res
          .status(400)
          .json({ message: 'Already on the requested plan' });
      }

      const updatedSubscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: newPriceId,
            },
          ],
          proration_behavior: 'create_prorations',
        }
      );

      res.json({
        success: true,
        message: `Plan changed to ${newPlan} successfully`,
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          plan: newPlan,
        },
      });
    } catch (error: any) {
      console.error('Plan change error:', error);
      res
        .status(500)
        .json({ message: 'Failed to change plan: ' + error.message });
    }
  });

  // Cancel subscription with retention offer
  app.post('/api/cancel-subscription', requireAuth, async (req: any, res) => {
    const user = req.user;
    const { cancelImmediately = false, reason } = req.body;

    if (!user?.stripeSubscriptionId || !stripe) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      let subscription;

      if (cancelImmediately) {
        // Cancel immediately
        subscription = await stripe.subscriptions.cancel(
          user.stripeSubscriptionId
        );
        await storage.updateUserSubscriptionPlan(user?.id || '', 'free');
      } else {
        // Cancel at period end
        subscription = await stripe.subscriptions.update(
          user.stripeSubscriptionId,
          {
            cancel_at_period_end: true,
            metadata: {
              cancellation_reason: reason || 'user_requested',
            },
          }
        );
      }

      res.json({
        success: true,
        message: cancelImmediately
          ? 'Subscription canceled immediately'
          : 'Subscription will cancel at the end of the billing period',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: (subscription as any).current_period_end,
        },
      });
    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      res
        .status(500)
        .json({ message: 'Failed to cancel subscription: ' + error.message });
    }
  });

  // Reactivate canceled subscription
  app.post(
    '/api/reactivate-subscription',
    requireAuth,
    async (req: any, res) => {
      const user = req.user;

      if (!user?.stripeSubscriptionId || !stripe) {
        return res.status(400).json({ message: 'No subscription found' });
      }

      try {
        const subscription = await stripe.subscriptions.update(
          user.stripeSubscriptionId,
          {
            cancel_at_period_end: false,
          }
        );

        await storage.updateUserSubscriptionPlan(user?.id || '', 'premium');

        res.json({
          success: true,
          message: 'Subscription reactivated successfully',
          subscription: {
            id: subscription.id,
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
        });
      } catch (error: any) {
        console.error('Subscription reactivation error:', error);
        res.status(500).json({
          message: 'Failed to reactivate subscription: ' + error.message,
        });
      }
    }
  );

  // Stripe webhook handler
  app.post(
    '/api/stripe-webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      if (!stripe) {
        return res.status(500).json({ message: 'Stripe not configured' });
      }

      const sig = req.headers['stripe-signature'];
      let event;

      try {
        // In production, you should set STRIPE_WEBHOOK_SECRET
        event = stripe.webhooks.constructEvent(
          req.body,
          sig as string,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.created':
            const subscription = event.data.object as any;
            const customerId = subscription.customer;

            // Find user by customer ID
            const customer = await stripe.customers.retrieve(customerId);
            if (customer.deleted) break;

            const userId = (customer as any).metadata?.userId;
            if (userId) {
              const subscriptionPlan =
                subscription.status === 'active' ||
                subscription.status === 'trialing'
                  ? 'premium'
                  : 'free';
              await storage.updateUserSubscriptionPlan(
                userId,
                subscriptionPlan
              );
              console.log(
                `Updated user ${userId} subscription to ${subscriptionPlan}`
              );
            }
            break;

          case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object as any;
            const deletedCustomerId = deletedSubscription.customer;

            const deletedCustomer = await stripe.customers.retrieve(
              deletedCustomerId
            );
            if (deletedCustomer.deleted) break;

            const deletedUserId = (deletedCustomer as any).metadata?.userId;
            if (deletedUserId) {
              await storage.updateUserSubscriptionPlan(deletedUserId, 'free');
              console.log(`Downgraded user ${deletedUserId} to free plan`);
            }
            break;

          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ message: 'Webhook processing failed' });
      }

      res.json({ received: true });
    }
  );

  // Update subscription status after successful payment
  app.post(
    '/api/update-subscription-status',
    requireAuth,
    async (req: any, res) => {
      try {
        const userId = req.userId;
        const { status } = req.body;

        if (status === 'premium') {
          await storage.updateUserSubscriptionPlan(userId, 'premium');
          console.log(`Updated user ${userId} to premium status`);
        }

        res.json({ message: 'Subscription status updated successfully' });
      } catch (error) {
        console.error('Error updating subscription status:', error);
        res
          .status(500)
          .json({ message: 'Failed to update subscription status' });
      }
    }
  );

  // Profile setup endpoint with serverless-compatible auth
  app.post('/api/profile/setup', authLimiter, async (req: any, res) => {
    try {
      // Check if Clerk is configured
      if (!isClerkConfigured) {
        return res
          .status(503)
          .json({ message: 'Authentication not configured' });
      }

      // Extract auth token from headers
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ message: 'No valid authorization token' });
      }

      const token = authHeader.replace('Bearer ', '');
      let userId: string;

      console.log(
        'Token verification - Received auth header:',
        authHeader ? 'Present' : 'Missing'
      );
      console.log('Token verification - Token length:', token.length);

      try {
        // Use Clerk to verify the session token
        const verifiedToken = await clerkClient.verifyToken(token);
        userId = verifiedToken.sub;
        console.log('Token verification - Success, userId:', userId);
      } catch (authError) {
        console.error('Token verification failed:', authError);
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'User ID not found in token' });
      }

      // Check if user exists, create if not
      let user = await storage.getUser(userId);
      if (!user) {
        console.log(
          'User not found in database, creating new user for profile setup:',
          userId
        );
        try {
          // Get user info from Clerk
          const clerkUser = await clerkClient.users.getUser(userId);

          const userData = {
            id: userId,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            profileImageUrl: clerkUser.imageUrl || '',
            subscriptionPlan: 'free', // Default to free plan
          };

          user = await storage.upsertUser(userData);
          console.log('Created new user for profile setup:', user);
        } catch (createError) {
          console.error(
            'Failed to create user for profile setup:',
            createError
          );
          return res.status(500).json({ message: 'Failed to create user' });
        }
      }

      const {
        dateOfBirth,
        wineExperienceLevel,
        preferredWineTypes,
        budgetRange,
        location,
      } = req.body;

      console.log('Profile setup request:', {
        userId,
        dateOfBirth,
        wineExperienceLevel,
        preferredWineTypes,
        budgetRange,
        location,
      });

      // Validate age (must be 18+)
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < 18) {
          return res
            .status(400)
            .json({ message: 'You must be 18 or older to use cork' });
        }
      }

      console.log('Calling storage.updateUserProfile with userId:', userId);
      const updatedUser = await storage.updateUserProfile(userId, {
        dateOfBirth,
        wineExperienceLevel,
        preferredWineTypes,
        budgetRange,
        location,
      });

      console.log('Profile updated successfully:', updatedUser);

      res.json({
        message: 'Profile setup completed successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('=== PROFILE SETUP ERROR DETAILS ===');
      console.error('Error:', error);
      console.error('Error name:', (error as any)?.name);
      console.error('Error message:', (error as any)?.message);
      console.error('Error stack:', (error as any)?.stack);
      console.error('Error constructor:', (error as any)?.constructor?.name);
      console.error('=====================================');

      res.status(500).json({
        message: 'Failed to set up profile',
        error: (error as any)?.message || 'Unknown error',
        errorType: (error as any)?.constructor?.name || 'UnknownError',
        details:
          (error as any)?.stack?.split('\n')[0] || 'No additional details',
      });
    }
  });

  // Downgrade to free plan endpoint
  app.post('/api/downgrade-to-free', requireAuth, async (req: any, res) => {
    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Cancel Stripe subscription if it exists
      if (user.stripeSubscriptionId && stripe) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          console.log(
            `Cancelled Stripe subscription ${user.stripeSubscriptionId} for user ${userId}`
          );
        } catch (stripeError) {
          console.error('Error cancelling Stripe subscription:', stripeError);
          // Continue with local downgrade even if Stripe fails
        }
      }

      // Update user to free plan
      await storage.updateUserSubscriptionPlan(userId, 'free');
      await storage.updateUserStripeInfo(
        userId,
        user.stripeCustomerId || '',
        null
      );

      res.json({
        message: 'Successfully downgraded to free plan',
        subscriptionPlan: 'free',
      });
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      res.status(500).json({ message: 'Failed to downgrade subscription' });
    }
  });

  // Test endpoint to reset subscription for testing
  app.post(
    '/api/reset-subscription-test',
    requireAuth,
    async (req: any, res) => {
      try {
        const userId = req.userId;

        // Reset user subscription status for testing
        await storage.updateUserSubscriptionPlan(userId, 'free');

        // Note: In production, you would also cancel the Stripe subscription
        // For testing, we'll just reset the local status

        res.json({ message: 'Subscription reset for testing' });
      } catch (error) {
        console.error('Error resetting subscription:', error);
        res.status(500).json({ message: 'Failed to reset subscription' });
      }
    }
  );

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ message: 'Name, email, and message are required' });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Valid email is required' });
      }

      // Send contact form email via SendGrid
      const { sendContactFormEmail } = await import('./emailService');
      const emailSent = await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
      });

      if (emailSent) {
        console.log(`Contact form email sent from ${email}`);
      }

      res.json({
        message: 'Message sent successfully',
        emailSent,
      });
    } catch (error: any) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Email signup endpoint
  app.post('/api/email-signup', emailSignupLimiter, async (req, res) => {
    try {
      const { email, firstName } = req.body || {};

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email required' });
      }

      console.log('EMAIL_SIGNUP:', email, new Date().toISOString());

      // Try to save to database if available
      try {
        if (process.env.DATABASE_URL && db) {
          await storage.saveEmailSignup(email);
          console.log(`Email saved to database: ${email}`);
        }
      } catch (dbError: any) {
        console.log(`Database save failed for ${email}:`, dbError.message);
      }

      // Try to send confirmation email
      try {
        await sendEmailSignupConfirmation({ email, firstName });
        console.log(`Confirmation email sent to: ${email}`);
      } catch (emailError: any) {
        console.log(`Email send failed for ${email}:`, emailError.message);
      }

      res.json({
        message:
          "Thank you for signing up! You'll be notified when cork launches.",
        success: true,
      });
    } catch (error: any) {
      console.error('Email signup error:', error.message);
      res.status(500).json({ message: 'Please try again' });
    }
  });

  // View email signups (admin/development endpoint)
  app.get('/api/email-signups', async (req, res) => {
    try {
      const { emailSignups } = await import('../shared/schema.js');
      const { db } = await import('./db.js');

      const signups = await db
        .select()
        .from(emailSignups)
        .orderBy(emailSignups.createdAt);

      res.json({
        total: signups.length,
        signups: signups.map((signup: any) => ({
          id: signup.id,
          email: signup.email,
          firstName: signup.firstName,
          createdAt: signup.createdAt,
        })),
      });
    } catch (error) {
      console.error('Error fetching email signups:', error);
      res.status(500).json({ message: 'Failed to fetch signups' });
    }
  });

  // Test endpoint to verify error handler fix (development only)
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/test-error-handler', (req, res, next) => {
      console.log('Test error endpoint called - triggering intentional error');
      const error = new Error('Test error for error handler verification');
      (error as any).status = 400;
      next(error); // This should trigger the error handler without crashing the server
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
