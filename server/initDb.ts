import { db } from "./db";
import * as schema from "@shared/schema";

export async function initializeDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Test database connection with a simple query
    await db.execute('SELECT 1 as test');
    console.log('Database connection successful');
    
    // Check if email_signups table exists
    try {
      await db.select().from(schema.emailSignups).limit(1);
      console.log('Email signups table exists');
    } catch (error: any) {
      if (error.message.includes('relation "email_signups" does not exist')) {
        console.warn('Email signups table does not exist - run database migrations');
        return false;
      }
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Database initialization failed:', error.message);
    return false;
  }
}