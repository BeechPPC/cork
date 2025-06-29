# Fix Clerk Production Authentication

## Issue Identified

The sign-in functionality works on localhost but not on getcork.app because the production Clerk key is malformed.

## Current Problem

In your `.env` file, the production Clerk key is:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZ2V0Y29yay5hcHAk
```

This key is **malformed** and not a valid Clerk key.

## Solution

### Step 1: Get Correct Production Keys

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** section
4. Copy the **Publishable Key** (starts with `pk_live_`)
5. Copy the **Secret Key** (starts with `sk_live_`)

### Step 2: Update Environment Variables

Replace the current keys in your `.env` file:

**Current (BROKEN):**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZ2V0Y29yay5hcHAk
CLERK_SECRET_KEY=sk_live_B0JQMpchqIiRm4eO6yztaQIG7BTueYrsQmzPujU7Eu
```

**Replace with (CORRECT):**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PRODUCTION_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
```

### Step 3: Configure Clerk Dashboard

1. In Clerk Dashboard → **Settings** → **Domains**
2. Add `getcork.app` as an authorized domain
3. Set allowed origins to include `https://getcork.app`
4. Configure redirect URLs:
   - Sign-in redirect: `https://getcork.app`
   - Sign-up redirect: `https://getcork.app`
   - After sign-out: `https://getcork.app`

### Step 4: Deploy Changes

After updating the environment variables:

1. Commit and push the changes
2. Redeploy your application
3. Test the sign-in functionality on getcork.app

## Temporary Workaround

If you need to test immediately, you can temporarily use the test keys:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cmFyZS1ha2l0YS03OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_CNUhvfTQqvw08Vp5eoLnmsDrIeOvmJczyfAGT1Jwuu
```

## Verification

After fixing, check the browser console on getcork.app for:

- ✅ "Clerk authentication enabled for getcork.app"
- No ⚠️ warning messages about invalid keys

## Files Modified

- `client/src/lib/clerk.ts` - Enhanced key validation and debugging
- `client/src/main.tsx` - Removed hardcoded domain configuration
