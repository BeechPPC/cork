import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import {
  User,
  SavedWine,
  UploadedWine,
  RecommendationHistory,
  EmailSignup,
} from '../shared/schema.js';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
      });
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
    }
  } else {
    console.warn(
      '⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found - using default credentials'
    );
    try {
      initializeApp();
      console.log('✅ Firebase Admin initialized with default credentials');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
    }
  }
}

const db = getFirestore();

class FirebaseStorage {
  // User operations
  async getUserByFirebaseId(firebaseId: string): Promise<User | null> {
    try {
      const userDoc = await db.collection('users').doc(firebaseId).get();
      if (userDoc.exists) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by Firebase ID:', error);
      return null;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    return this.getUserByFirebaseId(userId);
  }

  async createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    try {
      const userRef = db.collection('users').doc(userData.firebaseId);
      const user: User = {
        ...userData,
        id: userData.firebaseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userRef.set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(
    firebaseId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    try {
      const userRef = db.collection('users').doc(firebaseId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await userRef.update(updateData);
      return this.getUserByFirebaseId(firebaseId);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async updateUserProfile(
    userId: string,
    profileData: Partial<User>
  ): Promise<User | null> {
    return this.updateUser(userId, profileData);
  }

  async updateUserStripeInfo(
    userId: string,
    stripeData: { stripeCustomerId?: string; stripeSubscriptionId?: string }
  ): Promise<User | null> {
    return this.updateUser(userId, stripeData);
  }

  async updateUserSubscriptionPlan(
    userId: string,
    plan: 'free' | 'premium'
  ): Promise<User | null> {
    return this.updateUser(userId, { subscriptionPlan: plan });
  }

  // Saved wines operations
  async saveWine(
    wineData: Omit<SavedWine, 'id' | 'createdAt'>
  ): Promise<SavedWine> {
    try {
      const wineRef = db.collection('saved_wines').doc();
      // Remove undefined fields before saving
      const wine: SavedWine = {
        ...wineData,
        id: wineRef.id,
        createdAt: new Date().toISOString(),
      };
      // Remove all undefined fields
      const wineClean = Object.fromEntries(
        Object.entries(wine).filter(([_, v]) => v !== undefined)
      );
      await wineRef.set(wineClean);
      return wine as SavedWine;
    } catch (error) {
      console.error('Error saving wine:', error);
      throw error;
    }
  }

  async getSavedWines(userId: string): Promise<SavedWine[]> {
    try {
      const querySnapshot = await db
        .collection('saved_wines')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return querySnapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as SavedWine)
      );
    } catch (error) {
      console.error('Error getting saved wines:', error);
      return [];
    }
  }

  async getSavedWineCount(userId: string): Promise<number> {
    try {
      const querySnapshot = await db
        .collection('saved_wines')
        .where('userId', '==', userId)
        .get();
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting saved wine count:', error);
      return 0;
    }
  }

  async deleteSavedWine(wineId: string): Promise<boolean> {
    try {
      await db.collection('saved_wines').doc(wineId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting saved wine:', error);
      return false;
    }
  }

  async removeSavedWine(wineId: string): Promise<boolean> {
    return this.deleteSavedWine(wineId);
  }

  // Uploaded wines operations
  async saveUploadedWine(
    wineData: Omit<UploadedWine, 'id' | 'createdAt'>
  ): Promise<UploadedWine> {
    try {
      const wineRef = db.collection('uploadedWines').doc();
      const wine: UploadedWine = {
        ...wineData,
        id: wineRef.id,
        createdAt: new Date().toISOString(),
      };
      await wineRef.set(wine);
      return wine;
    } catch (error) {
      console.error('Error saving uploaded wine:', error);
      throw error;
    }
  }

  async getUploadedWines(userId: string): Promise<UploadedWine[]> {
    try {
      const querySnapshot = await db
        .collection('uploadedWines')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return querySnapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as UploadedWine)
      );
    } catch (error) {
      console.error('Error getting uploaded wines:', error);
      return [];
    }
  }

  async getUploadedWineCount(userId: string): Promise<number> {
    try {
      const querySnapshot = await db
        .collection('uploadedWines')
        .where('userId', '==', userId)
        .get();
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting uploaded wine count:', error);
      return 0;
    }
  }

  async updateUploadedWine(
    wineId: string,
    updates: Partial<UploadedWine>
  ): Promise<UploadedWine | null> {
    try {
      const wineRef = db.collection('uploadedWines').doc(wineId);
      await wineRef.update(updates);
      const updatedDoc = await wineRef.get();
      if (updatedDoc.exists) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as UploadedWine;
      }
      return null;
    } catch (error) {
      console.error('Error updating uploaded wine:', error);
      return null;
    }
  }

  // Recommendation history operations
  async saveRecommendationHistory(
    historyData: Omit<RecommendationHistory, 'id' | 'createdAt'>
  ): Promise<RecommendationHistory> {
    try {
      const historyRef = db.collection('recommendationHistory').doc();
      const history: RecommendationHistory = {
        ...historyData,
        id: historyRef.id,
        createdAt: new Date().toISOString(),
      };
      await historyRef.set(history);
      return history;
    } catch (error) {
      console.error('Error saving recommendation history:', error);
      throw error;
    }
  }

  async getRecommendationHistory(
    userId: string,
    limitCount: number = 10
  ): Promise<RecommendationHistory[]> {
    try {
      const querySnapshot = await db
        .collection('recommendationHistory')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limitCount)
        .get();
      return querySnapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as RecommendationHistory)
      );
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      return [];
    }
  }

  // Usage tracking - Note: User interface doesn't include usage, so we'll track this separately
  async updateUserUsage(
    userId: string,
    usageType: 'savedWines' | 'uploadedWines'
  ): Promise<boolean> {
    try {
      // For now, we'll just return true since usage tracking is not part of the User interface
      // In the future, we could create a separate usage collection or extend the User interface
      console.log(`Usage update: ${userId} - ${usageType}`);
      return true;
    } catch (error) {
      console.error('Error updating user usage:', error);
      return false;
    }
  }

  // Email signup operations
  async saveEmailSignup(email: string): Promise<EmailSignup> {
    try {
      const signupRef = db.collection('emailSignups').doc();
      const signup: EmailSignup = {
        id: signupRef.id,
        email,
        createdAt: new Date().toISOString(),
      };
      await signupRef.set(signup);
      return signup;
    } catch (error) {
      console.error('Error saving email signup:', error);
      throw error;
    }
  }
}

export const storage = new FirebaseStorage();
