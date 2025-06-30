import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './shared/schema.ts';

neonConfig.webSocketConstructor = ws;

async function testStorage() {
  console.log('🔍 Testing storage layer...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const db = drizzle({ client: pool, schema });

  try {
    console.log('📡 Testing database connection...');

    // Test 1: Check if we can query the users table
    console.log('🔍 Test 1: Querying users table...');
    const users = await db.select().from(schema.users).limit(1);
    console.log('✅ Users query successful, found:', users.length, 'users');

    // Test 2: Try to create a test user
    console.log('🔍 Test 2: Creating test user...');
    const testUserData = {
      id: 'test_user_' + Date.now(),
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      subscriptionPlan: 'free',
    };

    console.log('📝 Test user data:', testUserData);

    try {
      const newUser = await db
        .insert(schema.users)
        .values(testUserData)
        .returning();
      console.log('✅ Test user created successfully:', newUser[0]);
    } catch (insertError) {
      console.error('❌ Failed to create test user:', insertError);
    }

    // Test 3: Try to update user profile
    console.log('🔍 Test 3: Updating user profile...');
    const testUserId = testUserData.id;

    try {
      const updatedUser = await db
        .update(schema.users)
        .set({
          dateOfBirth: '1990-01-01',
          wineExperienceLevel: 'novice',
          preferredWineTypes: ['Red Wine'],
          budgetRange: 'mid-range',
          location: 'Test Location',
          profileCompleted: true,
          updatedAt: new Date(),
        })
        .where(schema.users.id.eq(testUserId))
        .returning();

      console.log('✅ User profile updated successfully:', updatedUser[0]);
    } catch (updateError) {
      console.error('❌ Failed to update user profile:', updateError);
    }

    // Test 4: Clean up - delete test user
    console.log('🔍 Test 4: Cleaning up test user...');
    try {
      await db.delete(schema.users).where(schema.users.id.eq(testUserId));
      console.log('✅ Test user cleaned up successfully');
    } catch (deleteError) {
      console.error('❌ Failed to clean up test user:', deleteError);
    }

    console.log('✅ Storage test completed');
  } catch (error) {
    console.error('❌ Storage test failed:', error);
  } finally {
    await pool.end();
  }
}

testStorage();
