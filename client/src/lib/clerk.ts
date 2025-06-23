export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_clerk_publishable_key_for_development'

export const isClerkConfigured = clerkPubKey !== 'pk_test_placeholder_clerk_publishable_key_for_development'