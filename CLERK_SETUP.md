# Clerk Authentication Setup for Cork

## Quick Setup Guide

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your preferred sign-in methods (email/password, Google, etc.)

### 2. Get API Keys
From your Clerk Dashboard:
- Copy your **Publishable Key** (starts with `pk_`)
- Copy your **Secret Key** (starts with `sk_`)

### 3. Configure Environment Variables

**For Development (.env):**
```env
CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_publishable_key
```

**For Production (.env.production):**
```env
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_publishable_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Configure Webhooks (Optional but Recommended)
1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret to `CLERK_WEBHOOK_SECRET`

### 5. Configure Domain Settings
**CRITICAL:** In Clerk Dashboard → Settings → Domain:
1. Add `getcork.app` as an authorized domain
2. Set allowed origins to include `https://getcork.app`
3. Configure redirect URLs:
   - Sign-in redirect: `https://getcork.app`
   - Sign-up redirect: `https://getcork.app`
   - After sign-out: `https://getcork.app`

### 6. Test Authentication
Once configured with real keys and domain settings:
- Sign In/Get Started buttons will work on getcork.app
- Users can create accounts and sign in
- User data syncs to your database automatically

## Current Status
- ✅ Production keys configured
- ✅ Domain configured in Clerk Dashboard (DNS verified)
- ✅ Frontend components ready
- ✅ Backend middleware configured
- ✅ Database schema ready
- ✅ Webhook handler implemented
- ✅ Authentication fully functional on getcork.app

## Features Once Configured
- Beautiful sign-in/sign-up modals
- Passwordless authentication options
- Social login (Google, Facebook, etc.)
- Automatic user synchronization
- Session management
- Premium subscription handling