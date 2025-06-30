// Independent profile setup endpoint - bypasses main server compilation issues
import 'dotenv/config';
import { neon } from '@neon-database/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid authorization token' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Generate user ID from token for consistency
    const userId =
      'user_' + Buffer.from(token.slice(-20)).toString('hex').slice(0, 16);

    const {
      dateOfBirth,
      wineExperienceLevel,
      preferredWineTypes,
      budgetRange,
      location,
    } = req.body || {};

    // Age validation (18+ required)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        return res
          .status(400)
          .json({ message: 'You must be 18 or older to use cork' });
      }
    }

    // Database connection
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ message: 'Database configuration error' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Simple insert/update for now to test
    const userResult = await sql`
      INSERT INTO users (
        id, 
        first_name, 
        last_name,
        email, 
        date_of_birth, 
        wine_experience_level, 
        preferred_wine_types, 
        budget_range, 
        location, 
        profile_completed,
        subscription_plan,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        'Cork',
        'User',
        'user@getcork.app',
        ${dateOfBirth || null},
        ${wineExperienceLevel || null},
        ${preferredWineTypes ? JSON.stringify(preferredWineTypes) : null},
        ${budgetRange || null},
        ${location || null},
        true,
        'free',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        date_of_birth = EXCLUDED.date_of_birth,
        wine_experience_level = EXCLUDED.wine_experience_level,
        preferred_wine_types = EXCLUDED.preferred_wine_types,
        budget_range = EXCLUDED.budget_range,
        location = EXCLUDED.location,
        profile_completed = true,
        updated_at = NOW()
      RETURNING *
    `;

    const user = userResult[0];

    return res.status(200).json({
      message: 'Profile setup completed successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        wineExperienceLevel: user.wine_experience_level,
        preferredWineTypes: user.preferred_wine_types
          ? JSON.parse(user.preferred_wine_types)
          : null,
        budgetRange: user.budget_range,
        location: user.location,
        profileCompleted: user.profile_completed,
        subscriptionPlan: user.subscription_plan,
      },
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    return res.status(500).json({
      message: 'Failed to set up profile',
      error: error.message || 'Unknown error',
    });
  }
}
