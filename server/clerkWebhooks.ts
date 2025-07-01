import { Webhook } from 'svix';
import express from 'express';
import type { Express } from 'express';
import { storage } from './storage.js';
import { UpsertUser } from '@shared/schema.js';

export function setupClerkWebhooks(app: Express) {
  // CRITICAL: Apply raw body parser ONLY to webhook route
  app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));

  // Webhook endpoint for Clerk user events
  app.post('/api/webhooks/clerk', async (req, res) => {
    console.log('📡 Clerk webhook received');
    console.log('📋 Headers:', req.headers);
    console.log('📄 Body type:', typeof req.body);
    console.log('📄 Body length:', req.body?.length || 0);

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('❌ CLERK_WEBHOOK_SECRET not found');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    try {
      const headers = req.headers;
      const payload = req.body;

      // Ensure payload is a string for svix
      const payloadString = Buffer.isBuffer(payload)
        ? payload.toString()
        : payload;

      console.log(
        '🔐 Verifying webhook with payload length:',
        payloadString.length
      );

      const wh = new Webhook(WEBHOOK_SECRET);

      let evt: any;

      try {
        evt = wh.verify(payloadString, {
          'svix-id': headers['svix-id'] as string,
          'svix-timestamp': headers['svix-timestamp'] as string,
          'svix-signature': headers['svix-signature'] as string,
        });
        console.log('✅ Webhook verification successful');
      } catch (err) {
        console.error('❌ Error verifying webhook:', err);
        console.error('❌ Headers received:', {
          'svix-id': headers['svix-id'],
          'svix-timestamp': headers['svix-timestamp'],
          'svix-signature': headers['svix-signature'] ? 'Present' : 'Missing',
        });
        return res.status(400).json({ error: 'Error verifying webhook' });
      }

      const { id } = evt.data;
      const eventType = evt.type;

      console.log(`📋 Webhook ID: ${id}, Type: ${eventType}`);
      console.log('📋 Full webhook data:', JSON.stringify(evt.data, null, 2));

      try {
        switch (eventType) {
          case 'user.created':
          case 'user.updated':
            console.log(`🚀 Processing ${eventType} event`);
            await handleUserUpsert(evt.data);
            break;
          case 'user.deleted':
            console.log('👋 User deleted:', evt.data.id);
            // TODO: Handle user deletion if needed
            break;
          default:
            console.log(`❓ Unhandled event type: ${eventType}`);
        }

        console.log('✅ Webhook processed successfully');
        return res.status(200).json({ received: true });
      } catch (handlerError) {
        console.error('❌ Error in webhook handler:', handlerError);
        console.error('❌ Handler error stack:', (handlerError as Error).stack);
        return res.status(500).json({
          error: 'Internal server error',
          message: (handlerError as Error).message,
        });
      }
    } catch (error) {
      console.error('❌ Unexpected webhook error:', error);
      console.error('❌ Unexpected error stack:', (error as Error).stack);
      return res.status(500).json({
        error: 'Internal server error',
        message: (error as Error).message,
      });
    }
  });
}

async function handleUserUpsert(userData: {
  id: number;
  email_addresses: { email_address: string }[];
  first_name: string;
  last_name: string;
  image_url: string;
}) {
  console.log('🚀 === HANDLING USER UPSERT ===');
  console.log('🆔 User ID:', userData.id);
  console.log('📧 Email addresses:', userData.email_addresses);
  console.log('👤 First name:', userData.first_name);
  console.log('👤 Last name:', userData.last_name);
  console.log('🖼️ Image URL:', userData.image_url);

  try {
    // Validate required data
    if (!userData.id) {
      throw new Error('User ID is required');
    }

    // Test storage availability
    if (!storage) {
      console.error('❌ Storage object is null/undefined');
      throw new Error('Storage not available');
    }

    const userToUpsert: UpsertUser = {
      id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      profileImageUrl: userData.image_url || '',
    };

    console.log('👤 Upserting user with data:', userToUpsert);

    // Test database connection first
    console.log('🔍 Testing database connection...');

    // Upsert the user
    const user = await storage.upsertUser(userToUpsert);
    console.log('✅ User synced successfully from Clerk:', user);

    // Verify the user was actually created
    console.log('🔍 Verifying user creation...');
    const verifyUser = await storage.getUser(userData.id);
    console.log('🔍 Verification result - User exists in DB:', !!verifyUser);

    if (verifyUser) {
      console.log('🔍 Verified user data:', {
        id: verifyUser.id,
        email: verifyUser.email,
        firstName: verifyUser.firstName,
        lastName: verifyUser.lastName,
        subscriptionPlan: verifyUser.subscriptionPlan,
      });
    } else {
      throw new Error(
        'User verification failed - user not found after creation'
      );
    }

    return user;
  } catch (error) {
    console.error('❌ CRITICAL ERROR in handleUserUpsert:');
    console.error('❌ Error name:', (error as Error).name);
    console.error('❌ Error message:', (error as Error).message);
    console.error('❌ Error stack:', (error as Error).stack);
    console.error('❌ Storage available:', !!storage);

    // Log the actual userData for debugging
    console.error('❌ UserData received:', JSON.stringify(userData, null, 2));

    // Re-throw to ensure webhook returns 500 status
    throw new Error(`User upsert failed: ${(error as Error).message}`);
  }
}
