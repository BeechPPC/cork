import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function testDatabase() {
  console.log('🔍 Testing database connection...');

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

  try {
    console.log('📡 Connecting to database...');
    const client = await pool.connect();

    console.log('✅ Connected to database');

    // Test query to check if users table exists
    console.log('🔍 Checking users table...');
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    console.log('📋 Users table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Test query to count users
    console.log('👥 Counting users...');
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM users'
    );
    console.log(`📊 Total users in database: ${countResult.rows[0].count}`);

    // Test query to see recent users
    console.log('👤 Recent users:');
    const usersResult = await client.query(`
      SELECT id, email, first_name, last_name, profile_completed, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    usersResult.rows.forEach(user => {
      console.log(
        `  - ID: ${user.id}, Email: ${user.email}, Profile Completed: ${user.profile_completed}, Created: ${user.created_at}`
      );
    });

    client.release();
    console.log('✅ Database test completed successfully');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
