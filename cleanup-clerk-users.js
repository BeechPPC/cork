// Script to delete users from Clerk
// Run this with: node cleanup-clerk-users.js

import { clerkClient } from '@clerk/clerk-sdk-node';

const CLERK_SECRET_KEY = 'sk_live_B0JQMpchqIiRm4eO6yztaQIG7BTueYrsQmzPujU7Eu';

async function deleteUserByEmail(email) {
  try {
    // Find user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (users.length === 0) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    const user = users[0];
    console.log(
      `Found user: ${user.id} (${user.emailAddresses[0].emailAddress})`
    );

    // Delete the user
    await clerkClient.users.deleteUser(user.id);
    console.log(`✅ Successfully deleted user: ${email}`);
  } catch (error) {
    console.error(`❌ Error deleting user ${email}:`, error.message);
  }
}

// Usage examples:
// deleteUserByEmail('user@example.com');

// Or delete multiple users:
const emailsToDelete = [
  // Add email addresses here
  // 'user1@example.com',
  // 'user2@example.com'
];

async function cleanupUsers() {
  for (const email of emailsToDelete) {
    await deleteUserByEmail(email);
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Uncomment to run:
// cleanupUsers();
