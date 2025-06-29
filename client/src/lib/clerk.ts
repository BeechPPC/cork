// Use Clerk key based on environment
export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// For production, only allow getcork.app domain
const isProductionDomain = window.location.hostname === 'getcork.app';
const isDevelopmentDomain =
  window.location.hostname.includes('replit.dev') ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

// Enable Clerk if we have a key and are on an allowed domain
const isDomainAllowed = isProductionDomain || isDevelopmentDomain;

export const isClerkConfigured =
  !!clerkPubKey && clerkPubKey.startsWith('pk_') && isDomainAllowed;

// Log configuration status for debugging
console.log('🔍 Clerk Configuration Debug:', {
  hasKey: !!clerkPubKey,
  keyPrefix: clerkPubKey.substring(0, 8),
  keyLength: clerkPubKey.length,
  isConfigured: isClerkConfigured,
  domain: window.location.hostname,
  port: window.location.port,
  fullUrl: window.location.href,
  environment: isProductionDomain ? 'production' : 'development',
  keyType: clerkPubKey.startsWith('pk_live_')
    ? 'production'
    : clerkPubKey.startsWith('pk_test_')
    ? 'development'
    : 'unknown',
  domainAllowed: isDomainAllowed,
  clerkInstance: 'rare-akita-78.clerk.accounts.dev',
  timestamp: new Date().toISOString(),
});

// Show helpful message for setup
if (!isClerkConfigured) {
  if (!clerkPubKey) {
    console.warn(
      '⚠️ Authentication disabled: VITE_CLERK_PUBLISHABLE_KEY not found in environment'
    );
  } else if (!clerkPubKey.startsWith('pk_')) {
    console.warn(
      '⚠️ Authentication disabled: Invalid Clerk key format - should start with pk_'
    );
  } else if (!isDomainAllowed) {
    console.warn(
      '⚠️ Authentication disabled: Domain not allowed for Clerk authentication'
    );
    console.warn('   Current domain:', window.location.hostname);
    console.warn(
      '   Allowed domains: getcork.app, localhost, 127.0.0.1, replit.dev'
    );
  } else {
    console.log(
      '🔒 Authentication configured but not working. Check Clerk dashboard settings.'
    );
  }
} else {
  console.log('✅ Clerk authentication enabled for', window.location.hostname);
}
