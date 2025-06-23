import { ClerkProvider } from '@clerk/clerk-react'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY