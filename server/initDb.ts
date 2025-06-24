import { db } from "./db";
import * as schema from "@shared/schema";

export async function initializeDatabase() {
  try {
    // Don't wait for database operations in serverless - just test connectivity
    const testPromise = db.execute('SELECT 1 as test');
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 2000)
    );
    
    await Promise.race([testPromise, timeoutPromise]);
    console.log('Database connection verified');
    return true;
  } catch (error: any) {
    console.warn('Database not available:', error.message);
    return false;
  }
}