import { Webhook } from 'svix'
import express from 'express'
import type { Express } from "express";
import { storage } from "./storage";

export function setupClerkWebhooks(app: Express) {
  // Webhook endpoint for Clerk user events
  app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET not found');
      return res.status(400).json({ error: 'Webhook secret not configured' });
    }

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
      console.error('Error verifying webhook:', err);
      return res.status(400).json({ error: 'Error verifying webhook' });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log('Webhook body:', evt.data);

    switch (eventType) {
      case 'user.created':
      case 'user.updated':
        await handleUserUpsert(evt.data);
        break;
      case 'user.deleted':
        // Handle user deletion if needed
        console.log('User deleted:', evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ received: true });
  });
}

async function handleUserUpsert(userData: any) {
  try {
    const user = await storage.upsertUser({
      id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      profileImageUrl: userData.image_url || '',
    });
    
    console.log('User synced from Clerk:', user);
  } catch (error) {
    console.error('Error syncing user from Clerk:', error);
  }
}