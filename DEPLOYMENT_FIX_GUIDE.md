# Cork Deployment Fix Guide

## Problem Summary

The deployment was failing due to a Rollup module resolution error: `Cannot find module @rollup/rollup-linux-x64-gnu`. This is a common issue with Vite applications deployed to Vercel.

## Fixes Implemented

### 1. Updated Vercel Configuration (`vercel.json`)

- Added proper `installCommand` with `npm ci --prefer-offline --no-audit`
- Added `NODE_ENV=production` environment variable
- Updated build command to use `npm run build:vercel`

### 2. Enhanced Package.json

- Added `build:vercel` script specifically for Vercel deployment
- This script only runs `vite build` without the server-side compilation

### 3. Improved Vite Configuration (`vite.config.ts`)

- Added `optimizeDeps.exclude` to exclude problematic Rollup dependencies
- Added `rollupOptions.external` configuration for production builds
- Updated string quotes for consistency

### 4. Created .npmrc Configuration

- Set `optional=false` to prevent optional dependency issues
- Added performance optimizations for npm install

## Deployment Steps

### 1. Clean Local Environment

```bash
# Remove existing build artifacts
rm -rf node_modules package-lock.json dist

# Reinstall dependencies
npm install
```

### 2. Test Build Locally

```bash
# Test the Vercel-specific build
npm run build:vercel

# Verify the build output exists
ls -la dist/public
```

### 3. Environment Variables

Ensure these environment variables are set in Vercel:

- `DATABASE_URL` - Your Neon database connection string
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `SENDGRID_API_KEY` - Your SendGrid API key
- `OPENAI_API_KEY` - Your OpenAI API key

### 4. Deploy to Vercel

```bash
# Deploy using Vercel CLI
vercel --prod

# Or push to your connected Git repository
git add .
git commit -m "Fix Vercel deployment issues"
git push
```

## Database Connection Verification

The database connection is properly configured for serverless environments:

- Uses Neon serverless driver
- Connection pooling with max 1 connection
- Proper timeout settings
- Graceful error handling

## Monitoring Deployment

After deployment, check:

1. Vercel build logs for any errors
2. Function logs for API endpoints
3. Database connection in production
4. User registration flow

## Troubleshooting

If issues persist:

1. **Clear Vercel Cache**: Delete the project and redeploy
2. **Check Environment Variables**: Verify all required env vars are set
3. **Database Connection**: Test database connectivity from Vercel functions
4. **Build Logs**: Review detailed build logs for specific errors

## Expected Outcome

After implementing these fixes:

- ✅ Vite build completes successfully
- ✅ No Rollup dependency errors
- ✅ User registration saves to Neon database
- ✅ All API endpoints function properly
- ✅ Static assets serve correctly

## Next Steps

1. Deploy the updated code
2. Test user registration flow
3. Monitor database connections
4. Verify all features work in production
5. Set up monitoring and alerts
