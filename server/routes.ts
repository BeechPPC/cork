import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getWineRecommendations, analyseWineImage } from "./openai";
import { insertSavedWineSchema, insertUploadedWineSchema, insertRecommendationHistorySchema } from "@shared/schema";
import { sendEmailSignupConfirmation } from "./emailService";
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
      const analysis = await analyseWineImage(base64Image);

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
  app.post('/api/create-checkout-session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only check Stripe if user is marked as premium in database
      if (user.subscriptionPlan === 'premium' && user.stripeSubscriptionId && stripe) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            return res.json({ 
              message: "Already subscribed",
              subscriptionId: subscription.id 
            });
          }
        } catch (error) {
          console.log('Stripe subscription error, allowing new subscription:', error);
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

      // Create Checkout Session with trial
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 7,
          metadata: {
            userId: userId,
            plan: plan
          }
        },
        metadata: {
          userId: userId,
          plan: plan
        },
        success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}&subscription=success`,
        cancel_url: `${req.headers.origin}/checkout?canceled=true`,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        customer_update: {
          address: 'auto',
          name: 'auto'
        }
      });

      console.log('Checkout session created:', {
        sessionId: session.id,
        customerId: customerId,
        priceId: priceId,
        plan: plan,
        stripeMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST'
      });

      res.json({
        sessionId: session.id,
        url: session.url
      });
    } catch (error: any) {
      console.error("Checkout session creation error:", error);
      
      // Handle specific Stripe errors
      if (error.type === 'StripeInvalidRequestError' && error.message?.includes('currency')) {
        res.status(400).json({ 
          message: "This customer already has an active subscription. Please contact support to modify your subscription.",
          hasActiveSubscription: true 
        });
      } else {
        res.status(500).json({ message: "Failed to create checkout session: " + error.message });
      }
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

  // Update subscription status after successful payment
  app.post('/api/update-subscription-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.body;
      
      if (status === 'premium') {
        await storage.updateUserSubscriptionPlan(userId, 'premium');
        console.log(`Updated user ${userId} to premium status`);
      }
      
      res.json({ message: "Subscription status updated successfully" });
    } catch (error) {
      console.error("Error updating subscription status:", error);
      res.status(500).json({ message: "Failed to update subscription status" });
    }
  });

  // Profile setup endpoint
  app.post('/api/profile/setup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { dateOfBirth, wineExperienceLevel, preferredWineTypes, budgetRange, location } = req.body;
      
      // Validate age (must be 18+)
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          return res.status(400).json({ message: "You must be 18 or older to use cork" });
        }
      }
      
      const updatedUser = await storage.updateUserProfile(userId, {
        dateOfBirth,
        wineExperienceLevel,
        preferredWineTypes,
        budgetRange,
        location
      });
      
      res.json({ 
        message: "Profile setup completed successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error setting up profile:", error);
      res.status(500).json({ message: "Failed to set up profile" });
    }
  });

  // Downgrade to free plan endpoint
  app.post('/api/downgrade-to-free', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Cancel Stripe subscription if it exists
      if (user.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          console.log(`Cancelled Stripe subscription ${user.stripeSubscriptionId} for user ${userId}`);
        } catch (stripeError) {
          console.error("Error cancelling Stripe subscription:", stripeError);
          // Continue with local downgrade even if Stripe fails
        }
      }
      
      // Update user to free plan
      await storage.updateUserSubscriptionPlan(userId, 'free');
      await storage.updateUserStripeInfo(userId, user.stripeCustomerId || '', null);
      
      res.json({ 
        message: "Successfully downgraded to free plan",
        subscriptionPlan: "free"
      });
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      res.status(500).json({ message: "Failed to downgrade subscription" });
    }
  });

  // Test endpoint to reset subscription for testing
  app.post('/api/reset-subscription-test', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Reset user subscription status for testing
      await storage.updateUserSubscriptionPlan(userId, 'free');
      
      // Note: In production, you would also cancel the Stripe subscription
      // For testing, we'll just reset the local status
      
      res.json({ message: "Subscription reset for testing" });
    } catch (error) {
      console.error("Error resetting subscription:", error);
      res.status(500).json({ message: "Failed to reset subscription" });
    }
  });

  // Email signup for pre-launch
  app.post("/api/email-signup", async (req, res) => {
    try {
      const { email, firstName } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      // Check if email already exists
      try {
        await storage.saveEmailSignup(email);
      } catch (error: any) {
        if (error.message && error.message.includes('duplicate key')) {
          return res.status(409).json({ message: "Email already registered" });
        }
        throw error;
      }

      // Send confirmation email
      const emailSent = await sendEmailSignupConfirmation({ 
        email, 
        firstName: firstName || undefined 
      });

      if (emailSent) {
        console.log(`Email signup confirmation sent to ${email}`);
      }

      res.json({ 
        message: "Email saved successfully",
        confirmationSent: emailSent
      });
    } catch (error: any) {
      console.error("Error saving email signup:", error);
      res.status(500).json({ message: "Failed to save email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
