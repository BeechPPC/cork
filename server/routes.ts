import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getWineRecommendations, analyzeWineImage } from "./openai";
import { insertSavedWineSchema, insertUploadedWineSchema, insertRecommendationHistorySchema } from "@shared/schema";
import Stripe from "stripe";
import multer from "multer";

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found - Stripe features will be disabled');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
}) : null;

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get usage counts for plan limits
      const savedWineCount = await storage.getSavedWineCount(userId);
      const uploadedWineCount = await storage.getUploadedWineCount(userId);
      
      res.json({
        ...user,
        usage: {
          savedWines: savedWineCount,
          uploadedWines: uploadedWineCount,
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Meal pairing analysis endpoint (Premium feature)
  app.post("/api/analyze-meal-pairing", upload.single("image"), isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has premium access
      if (user.subscriptionPlan !== 'premium') {
        return res.status(403).json({ 
          message: "Premium feature required",
          upgrade: true 
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const analysisType = req.body.analysisType as 'meal' | 'menu';
      if (!analysisType || !['meal', 'menu'].includes(analysisType)) {
        return res.status(400).json({ message: "Invalid analysis type" });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Import and analyze meal/menu 
      const { analyzeMealPairing } = await import("./openai");
      const result = await analyzeMealPairing(base64Image, analysisType);
      
      res.json(result);
    } catch (error) {
      console.error("Meal pairing analysis error:", error);
      res.status(500).json({ message: "Analysis failed" });
    }
  });

  // Wine recommendations
  app.post("/api/recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required" });
      }

      const userId = req.user.claims.sub;
      const recommendations = await getWineRecommendations(query);

      // Save to history
      await storage.saveRecommendationHistory({
        userId,
        query,
        recommendations,
      });

      res.json({ recommendations });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Save wine to cellar
  app.post("/api/cellar/save", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check plan limits
      const savedWineCount = await storage.getSavedWineCount(userId);
      if (user.subscriptionPlan === 'free' && savedWineCount >= 3) {
        return res.status(403).json({ 
          message: "Plan limit reached", 
          planLimit: true,
          currentCount: savedWineCount,
          maxCount: 3,
        });
      }

      const wineData = insertSavedWineSchema.parse({ ...req.body, userId });
      const savedWine = await storage.saveWine(wineData);
      res.json(savedWine);
    } catch (error) {
      console.error("Error saving wine:", error);
      res.status(500).json({ message: "Failed to save wine" });
    }
  });

  // Get saved wines
  app.get("/api/cellar", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedWines = await storage.getSavedWines(userId);
      res.json(savedWines);
    } catch (error) {
      console.error("Error fetching saved wines:", error);
      res.status(500).json({ message: "Failed to fetch saved wines" });
    }
  });

  // Remove wine from cellar
  app.delete("/api/cellar/:wineId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wineId = parseInt(req.params.wineId);
      await storage.removeSavedWine(userId, wineId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing wine:", error);
      res.status(500).json({ message: "Failed to remove wine" });
    }
  });

  // Wine upload and analysis
  app.post("/api/upload/analyze", isAuthenticated, upload.single('wine_image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check plan limits
      const uploadedWineCount = await storage.getUploadedWineCount(userId);
      if (user.subscriptionPlan === 'free' && uploadedWineCount >= 3) {
        return res.status(403).json({ 
          message: "Upload limit reached", 
          planLimit: true,
          currentCount: uploadedWineCount,
          maxCount: 3,
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Wine image is required" });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Analyze with AI
      const analysis = await analyzeWineImage(base64Image);

      // Save uploaded wine record
      const uploadedWine = await storage.saveUploadedWine({
        userId,
        originalImageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
        ...analysis,
      });

      res.json(uploadedWine);
    } catch (error) {
      console.error("Error analyzing wine:", error);
      res.status(500).json({ message: "Failed to analyze wine" });
    }
  });

  // Get uploaded wines
  app.get("/api/uploads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const uploadedWines = await storage.getUploadedWines(userId);
      res.json(uploadedWines);
    } catch (error) {
      console.error("Error fetching uploaded wines:", error);
      res.status(500).json({ message: "Failed to fetch uploaded wines" });
    }
  });

  // Subscription management endpoint
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId && stripe) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          return res.json({ 
            message: "Already subscribed",
            subscriptionId: subscription.id 
          });
        }
      }

      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || '',
          name: user.firstName || user.lastName || 'Cork User',
          metadata: { userId: user.id }
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, null);
      }

      // Get price ID based on plan (default to monthly)
      const plan = req.body.plan || 'monthly';
      const priceId = plan === 'yearly' 
        ? process.env.STRIPE_YEARLY_PRICE_ID 
        : process.env.STRIPE_MONTHLY_PRICE_ID;

      if (!priceId) {
        return res.status(500).json({ 
          message: `Stripe price ID not configured for ${plan} plan. Please contact support.` 
        });
      }

      // Create subscription with trial
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 7,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      const latestInvoice = subscription.latest_invoice as any;
      const setupIntent = subscription.pending_setup_intent as any;
      const clientSecret = latestInvoice?.payment_intent?.client_secret || setupIntent?.client_secret;

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
        trialEnd: subscription.trial_end
      });
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ message: "Failed to create subscription: " + error.message });
    }
  });

  // Stripe webhook handler
  app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // In production, you should set STRIPE_WEBHOOK_SECRET
      event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
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
            const subscriptionPlan = (subscription.status === 'active' || subscription.status === 'trialing') ? 'premium' : 'free';
            await storage.updateUserSubscriptionPlan(userId, subscriptionPlan);
            console.log(`Updated user ${userId} subscription to ${subscriptionPlan}`);
          }
          break;

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as any;
          const deletedCustomerId = deletedSubscription.customer;
          
          const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId);
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
  });

  const httpServer = createServer(app);
  return httpServer;
}
