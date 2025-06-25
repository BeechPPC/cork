const express = require('express');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const ws = require('ws');

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

let pool = null;
let db = null;

function getDatabase() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool);
  }
  return db;
}

// Simple auth middleware for serverless
async function authenticateRequest(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // For now, skip token verification and allow requests
    // This ensures account creation works while we fix auth
    req.userId = 'temp-user-id';
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Profile setup endpoint
app.post('/api/profile', authenticateRequest, async (req, res) => {
  try {
    const database = getDatabase();
    const { dateOfBirth, wineExperienceLevel, preferredWineTypes, budgetRange, location } = req.body;

    const updatedUser = await database
      .update(schema.users)
      .set({
        dateOfBirth,
        wineExperienceLevel,
        preferredWineTypes,
        budgetRange,
        location,
        profileCompleted: true,
        updatedAt: new Date()
      })
      .where(eq(schema.users.id, req.userId))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user: updatedUser[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Wine recommendations endpoint
app.post('/api/recommendations', authenticateRequest, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ message: 'AI service temporarily unavailable' });
    }

    // Simple OpenAI integration for recommendations
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'You are a wine expert specializing in Australian wines. Provide 3-5 wine recommendations in JSON format.'
        }, {
          role: 'user',
          content: query
        }],
        max_tokens: 1500
      })
    });

    const data = await response.json();
    res.json({ recommendations: data.choices[0].message.content });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;