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

  // Stripe subscription routes
  if (stripe) {
    app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        let user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string, {
            expand: ['payment_intent'],
          });

          res.json({
            subscriptionId: subscription.id,
            clientSecret: (latestInvoice.payment_intent as any)?.client_secret,
          });
          return;
        }
        
        if (!user.email) {
          throw new Error('No user email on file');
        }

        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });

        // For demo purposes, create a test price if STRIPE_PRICE_ID is not set
        let priceId = process.env.STRIPE_PRICE_ID;
        if (!priceId) {
          console.log('Creating test price for demo...');
          const price = await stripe.prices.create({
            unit_amount: 1900, // $19.00
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: {
              name: 'Cork Premium Plan',
            },
          });
          priceId = price.id;
        }

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            price: priceId,
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
        
        // Get the payment intent from the expanded latest invoice
        const latestInvoice = subscription.latest_invoice as any;
        const clientSecret = latestInvoice?.payment_intent?.client_secret;
    
        res.json({
          subscriptionId: subscription.id,
          clientSecret: clientSecret,
        });
      } catch (error) {
        console.error("Stripe subscription error:", error);
        return res.status(400).json({ error: { message: (error as Error).message } });
      }
    });

    // Stripe webhook handler
    app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
      try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !webhookSecret) {
          return res.status(400).send('Missing signature or webhook secret');
        }

        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        switch (event.type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            // Handle subscription changes
            console.log(`Subscription ${event.type}:`, subscription.id);
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
      } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${(error as Error).message}`);
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
