// Use production key for getcork.app, disable for other domains
export const clerkPubKey = window.location.hostname === 'getcork.app'
  ? (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '')
  : ''

export const isClerkConfigured = !!clerkPubKey && clerkPubKey.startsWith('pk_')

// Log configuration status for debugging
console.log('Clerk Configuration:', {
  hasKey: !!clerkPubKey,
  keyPrefix: clerkPubKey.substring(0, 6),
  isConfigured: isClerkConfigured,
  domain: window.location.hostname,
  environment: window.location.hostname === 'getcork.app' ? 'production' : 'development',
  keyType: clerkPubKey.startsWith('pk_live_') ? 'production' : clerkPubKey.startsWith('pk_test_') ? 'development' : 'unknown'
});

// Show helpful message for setup
if (!isClerkConfigured) {
  if (window.location.hostname === 'getcork.app') {
    console.warn('Authentication disabled: VITE_CLERK_PUBLISHABLE_KEY not properly configured');
  } else {
    console.log('🔒 Authentication disabled for development. Please test on getcork.app for full functionality.');
    console.log('💡 Clerk production keys are domain-restricted to getcork.app for security.');
  }
}