// Use Clerk key based on environment
export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// For production, only allow getcork.app domain
const isProductionDomain = window.location.hostname === 'getcork.app';
const isDevelopmentDomain =
  window.location.hostname.includes('replit.dev') ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

// Enable Clerk if we have a valid key and are on an allowed domain
const isDomainAllowed = isProductionDomain || isDevelopmentDomain;
const hasValidKey =
  clerkPubKey &&
  clerkPubKey.length > 50 &&
  (clerkPubKey.startsWith('pk_test_') || clerkPubKey.startsWith('pk_live_'));

export const isClerkConfigured = hasValidKey && isDomainAllowed;

// Log configuration status for debugging
console.log('Clerk Configuration:', {
  hasKey: !!clerkPubKey,
  keyPrefix: clerkPubKey.substring(0, 8),
  isConfigured: isClerkConfigured,
  domain: window.location.hostname,
  environment: isProductionDomain ? 'production' : 'development',
  keyType: clerkPubKey.startsWith('pk_live_')
    ? 'production'
    : clerkPubKey.startsWith('pk_test_')
    ? 'development'
    : 'unknown',
  domainAllowed: isDomainAllowed,
});

// Show helpful message for setup
if (!isClerkConfigured) {
  if (!clerkPubKey) {
    console.warn(
      '⚠️ Authentication disabled: VITE_CLERK_PUBLISHABLE_KEY not found in environment'
    );
  } else if (!isDomainAllowed) {
    console.warn(
      '⚠️ Authentication disabled: Domain not allowed for Clerk authentication'
    );
  } else {
    console.log(
      '🔒 Authentication configured but not working. Check Clerk dashboard settings.'
    );
  }
} else {
  console.log('✅ Clerk authentication enabled for', window.location.hostname);
}
