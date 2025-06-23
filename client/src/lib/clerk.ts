export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export const isClerkConfigured = !!clerkPubKey && clerkPubKey.startsWith('pk_')

// Show helpful message for setup
if (!isClerkConfigured) {
  console.warn('Authentication disabled: VITE_CLERK_PUBLISHABLE_KEY not found');
}