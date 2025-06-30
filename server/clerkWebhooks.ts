import { Webhook } from 'svix';
import express from 'express';
import type { Express } from 'express';
import { storage } from './storage.js';

export function setupClerkWebhooks(app: Express) {
  // Webhook endpoint for Clerk user events
  app.post(
    '/api/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      console.log('📡 Webhook received');

      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error('❌ CLERK_WEBHOOK_SECRET not found');
        return res.status(400).json({ error: 'Webhook secret not configured' });
      }

      try {
        const headers = req.headers;
        const payload = req.body;
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: any;

        try {
          evt = wh.verify(payload, {
            'svix-id': headers['svix-id'] as string,
            'svix-timestamp': headers['svix-timestamp'] as string,
            'svix-signature': headers['svix-signature'] as string,
          });
        } catch (err) {
          console.error('❌ Error verifying webhook:', err);
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
              await handleUserUpsert(evt.data);
              break;
            case 'user.deleted':
              console.log('👋 User deleted:', evt.data);
              break;
            default:
              console.log(`❓ Unhandled event type: ${eventType}`);
          }

          console.log('✅ Webhook processed successfully');
          return res.status(200).json({ received: true });
        } catch (handlerError) {
          console.error('❌ Error in webhook handler:', handlerError);
          console.error(
            '❌ Handler error stack:',
            (handlerError as Error).stack
          );
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
    }
  );
}

async function handleUserUpsert(userData: any) {
  console.log('🚀 === CLERK WEBHOOK TRIGGERED ===');
  console.log('🆔 User ID:', userData.id);
  console.log('📧 Email addresses:', userData.email_addresses);
  console.log('👤 First name:', userData.first_name);
  console.log('👤 Last name:', userData.last_name);
  console.log('🖼️ Image URL:', userData.image_url);

  try {
    // Test storage availability
    if (!storage) {
      console.error('❌ Storage object is null/undefined');
      throw new Error('Storage not available');
    }

    const userToUpsert = {
      id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      profileImageUrl: userData.image_url || '',
    };

    console.log('👤 Upserting user with data:', userToUpsert);

    // Test if we can call upsertUser
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
      });
    }

    return user;
  } catch (error) {
    console.error('❌ CRITICAL ERROR in handleUserUpsert:');
    console.error('❌ Error message:', (error as Error).message);
    console.error('❌ Error stack:', (error as Error).stack);
    console.error('❌ Storage available:', !!storage);

    // Log additional debugging info
    if ((error as Error).message) {
      console.error('❌ Detailed error:', (error as Error).message);
    }

    // Re-throw to ensure webhook returns 500 status
    throw new Error(`User upsert failed: ${(error as Error).message}`);
  }
}
