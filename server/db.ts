import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    // Create connection pool with serverless-friendly settings
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    
    db = drizzle({ client: pool, schema });
  } catch (error) {
    console.warn("Database initialization failed:", error);
    pool = null;
    db = null;
  }
} else {
  console.warn("DATABASE_URL not set - database features disabled");
}

export { pool, db };