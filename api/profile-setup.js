const admin = require('firebase-admin');

// Debug: Check if service account key is available
console.log('🔍 Profile Setup: Checking Firebase Admin initialization...');
console.log(
  '🔍 Profile Setup: GOOGLE_APPLICATION_CREDENTIALS:',
  process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'Set' : 'Not set'
);
console.log(
  '🔍 Profile Setup: FIREBASE_SERVICE_ACCOUNT_KEY:',
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set'
);

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    console.log('🔍 Profile Setup: Initializing Firebase Admin...');

    // Check if we have a service account key in environment
    let credential;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log(
        '🔍 Profile Setup: Using FIREBASE_SERVICE_ACCOUNT_KEY from environment'
      );
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      credential = admin.credential.cert(serviceAccount);
    } else {
      console.log('🔍 Profile Setup: Using application default credentials');
      credential = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential,
    });
    console.log('🔍 Profile Setup: Firebase Admin initialized successfully');
  } catch (error) {
    console.error(
      '❌ Profile Setup: Firebase Admin initialization error:',
      error
    );
  }
} else {
  console.log('🔍 Profile Setup: Firebase Admin already initialized');
}

const db = admin.firestore();

module.exports = async (req, res) => {
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid authorization token' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('🔍 Profile Setup: Token received, length:', token.length);

    // Verify Firebase token
    let decodedToken;
    try {
      console.log('🔍 Profile Setup: Verifying Firebase token...');
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log(
        '🔍 Profile Setup: Token verified successfully for user:',
        decodedToken.uid
      );
    } catch (error) {
      console.error('❌ Profile Setup: Token verification failed:', error);
      console.error('❌ Profile Setup: Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    const userId = decodedToken.uid;
    console.log('Profile setup for user:', userId);

    // Extract and validate profile data
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

    // Get user data from Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUser(userId);
    } catch (error) {
      console.error('Error getting user record:', error);
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare profile data for Firestore
    const profileData = {
      firebaseId: userId,
      email: userRecord.email,
      firstName: userRecord.displayName?.split(' ')[0] || null,
      lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || null,
      dateOfBirth: dateOfBirth || null,
      wineExperienceLevel: wineExperienceLevel || null,
      preferredWineTypes: preferredWineTypes || [],
      budgetRange: budgetRange || null,
      location: location || null,
      profileCompleted: true,
      subscriptionPlan: 'free',
      usage: {
        savedWines: 0,
        uploadedWines: 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    try {
      await db
        .collection('users')
        .doc(userId)
        .set(profileData, { merge: true });
      console.log('Profile saved to Firestore for user:', userId);
    } catch (error) {
      console.error('Error saving profile to Firestore:', error);
      return res.status(500).json({
        message: 'Failed to save profile to database',
        error: error.message,
      });
    }

    return res.status(200).json({
      message: 'Profile setup completed successfully',
      user: {
        id: userId,
        email: profileData.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        wineExperienceLevel: profileData.wineExperienceLevel,
        preferredWineTypes: profileData.preferredWineTypes,
        budgetRange: profileData.budgetRange,
        location: profileData.location,
        profileCompleted: profileData.profileCompleted,
        subscriptionPlan: profileData.subscriptionPlan,
      },
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    return res.status(500).json({
      message: 'Failed to set up profile',
      error: error.message || 'Unknown error',
    });
  }
};
