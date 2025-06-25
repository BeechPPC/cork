export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export const isClerkConfigured = !!clerkPubKey && clerkPubKey.startsWith('pk_')

// Log configuration status for debugging
console.log('Clerk Configuration:', {
  hasKey: !!clerkPubKey,
  keyPrefix: clerkPubKey.substring(0, 6),
  isConfigured: isClerkConfigured,
  domain: window.location.hostname
});

// Show helpful message for setup
if (!isClerkConfigured) {
  console.warn('Authentication disabled: VITE_CLERK_PUBLISHABLE_KEY not properly configured');
}