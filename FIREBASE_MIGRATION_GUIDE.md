# Firebase Migration Guide for Cork Wine App

This guide will help you migrate from Clerk (authentication) + Neon (database) to Firebase Auth + Firestore while maintaining all existing UI components and styling.

## Prerequisites

1. **Firebase Project Setup**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Get your Firebase configuration

2. **Install Dependencies**
   ```bash
   npm install firebase firebase-tools
   ```

## Environment Configuration

1. **Copy the environment example**

   ```bash
   cp env.example .env
   ```

2. **Add your Firebase configuration to `.env`**
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## Migration Steps

### Step 1: Update Authentication Components

Replace the current Clerk components with Firebase equivalents:

1. **Update `client/src/components/sign-in-button.tsx`**

   ```typescript
   // Replace Clerk import with Firebase
   import SignInButton from '@/components/firebase-auth/SignInButton';
   export default SignInButton;
   ```

2. **Update `client/src/components/user-button.tsx`**

   ```typescript
   // Replace Clerk import with Firebase
   import UserButton from '@/components/firebase-auth/UserButton';
   export default UserButton;
   ```

3. **Update `client/src/hooks/useAuth.ts`**
   ```typescript
   // Replace Clerk auth with Firebase auth
   export { useAuth } from '@/components/firebase-auth/AuthWrapper';
   ```

### Step 2: Update Header Component

In `client/src/components/header.tsx`, replace Clerk imports:

```typescript
// Replace these imports:
// import { SignInButton, SignUpButton, useClerk } from '@clerk/clerk-react';
// import { isClerkConfigured } from '@/lib/clerk';

// With these:
import SignInButton from '@/components/firebase-auth/SignInButton';
import SignUpButton from '@/components/firebase-auth/SignUpButton';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseConfigured } from '@/lib/auth';
import { signOut } from '@/lib/auth';

// Update the component to use Firebase auth
export default function Header() {
  const { user, isAuthenticated } = useAuth();

  // Replace useClerk() with direct signOut function
  const handleSignOut = async () => {
    try {
      await signOut();
      // Handle redirect if needed
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update all isClerkConfigured() calls to isFirebaseConfigured()
  // Update all Clerk components to Firebase components
}
```

### Step 3: Update API Request Functions

In `client/src/lib/queryClient.ts`, update the token retrieval:

```typescript
// Replace Clerk token retrieval with Firebase
import { getAuthToken } from '@/lib/auth';

// Update the apiRequest function
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  token?: string | null
): Promise<Response> {
  let authToken: string | null = token;
  if (!authToken) {
    try {
      authToken = await getAuthToken();
    } catch (error) {
      console.warn('Could not get Firebase token:', error);
    }
  }

  // Rest of the function remains the same
}
```

### Step 4: Update Database Operations

Replace Neon database calls with Firestore:

1. **Update wine operations in pages**

   ```typescript
   // Replace API calls with direct Firestore calls
   import {
     getSavedWines,
     createSavedWine,
     deleteSavedWine,
     getUploadedWines,
     createUploadedWine,
     deleteUploadedWine,
   } from '@/lib/database';
   import { useAuth } from '@/hooks/useAuth';

   // In your components:
   const { user } = useAuth();

   // Replace useQuery calls with direct Firestore calls
   const { data: savedWines } = useQuery({
     queryKey: ['saved-wines', user?.id],
     queryFn: () => (user ? getSavedWines(user.id) : Promise.resolve([])),
     enabled: !!user,
   });
   ```

### Step 5: Update File Upload Operations

Replace current upload logic with Firebase Storage:

```typescript
// Replace current upload logic with Firebase Storage
import { uploadWineImage, validateFile } from '@/lib/storage';

// In your upload components:
const handleFileUpload = async (file: File) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    toast({
      title: 'Invalid File',
      description: validation.error,
      variant: 'destructive',
    });
    return;
  }

  try {
    const imageUrl = await uploadWineImage(file, user.id, wineId);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Local Development Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (if not already done)

```bash
firebase init
```

### 4. Start Emulators

```bash
firebase emulators:start
```

### 5. Update Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "emulators": "firebase emulators:start",
    "deploy:rules": "firebase deploy --only firestore:rules,storage"
  }
}
```

## Security Rules Deployment

Deploy Firestore and Storage security rules:

```bash
firebase deploy --only firestore:rules,storage
```

## Data Migration (Optional)

If you have existing data in Neon, you can create a migration script:

```typescript
// scripts/migrate-data.ts
import { db } from '@/lib/database';
import {
  createUser,
  createSavedWine,
  createUploadedWine,
} from '@/lib/database';

// Migrate users
async function migrateUsers(neonUsers: any[]) {
  for (const user of neonUsers) {
    await createUser({
      id: user.clerkId, // Use Clerk ID as Firebase UID
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // ... other fields
    });
  }
}

// Migrate wines
async function migrateWines(neonWines: any[]) {
  for (const wine of neonWines) {
    await createSavedWine({
      userId: wine.userId,
      wineName: wine.wineName,
      // ... other fields
    });
  }
}
```

## Testing Checklist

- [ ] Sign in/up flows work correctly
- [ ] User authentication state persists
- [ ] Protected routes work
- [ ] Wine CRUD operations work
- [ ] File uploads work
- [ ] User profile management works
- [ ] Error handling matches current behavior
- [ ] Loading states work correctly
- [ ] Offline functionality works (Firestore default)

## Rollback Plan

If you need to rollback:

1. Keep Clerk dependencies in package.json
2. Maintain both auth systems in parallel
3. Use environment variable to switch between them
4. Gradually migrate components back if needed

## Performance Considerations

- Firestore provides offline support by default
- Use Firestore indexes for optimal query performance
- Consider implementing pagination for large datasets
- Use Firebase Storage CDN for fast image delivery

## Security Best Practices

- Always validate user permissions on the client and server
- Use Firestore security rules for data access control
- Implement proper error handling for auth failures
- Regularly review and update security rules

## Support

If you encounter issues during migration:

1. Check Firebase Console for error logs
2. Verify environment variables are correct
3. Ensure Firebase services are enabled
4. Test with Firebase emulators first
5. Review Firebase documentation for specific features

## Next Steps

After successful migration:

1. Remove Clerk dependencies
2. Clean up unused code
3. Update documentation
4. Monitor performance and errors
5. Consider additional Firebase features (Analytics, Crashlytics, etc.)
