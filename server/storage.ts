import {
  users,
  savedWines,
  uploadedWines,
  recommendationHistory,
  emailSignups,
  type User,
  type UpsertUser,
  type SavedWine,
  type UploadedWine,
  type InsertUploadedWine,
  type RecommendationHistory,
  type InsertRecommendationHistory,
  type EmailSignup,
  type CreateUser,
  type UpdateUser,
  type InsertSavedWine,
} from '../shared/schema.js';
import { db } from './db.js';
import { eq, desc, count } from 'drizzle-orm';

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  getUser(userId: number): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: CreateUser): Promise<User>;
  updateUser(user: UpdateUser): Promise<User>;
  updateUserStripeInfo(
    userId: number,
    stripeCustomerId: string,
    stripeSubscriptionId: string | null
  ): Promise<User>;
  updateUserSubscriptionPlan(
    userId: number,
    subscriptionPlan: string
  ): Promise<User>;
  updateUserProfile(
    userId: number,
    profileData: {
      dateOfBirth?: string;
      wineExperienceLevel?: string;
      preferredWineTypes?: string[];
      budgetRange?: string;
      location?: string;
    }
  ): Promise<User>;

  // Saved wines operations
  getSavedWines(userId: number): Promise<SavedWine[]>;
  getSavedWineCount(userId: number): Promise<number>;
  saveWine(wine: InsertSavedWine): Promise<SavedWine>;
  removeSavedWine(userId: number, wineId: number): Promise<void>;

  // Uploaded wines operations
  getUploadedWines(userId: number): Promise<UploadedWine[]>;
  getUploadedWineCount(userId: number): Promise<number>;
  saveUploadedWine(wine: InsertUploadedWine): Promise<UploadedWine>;
  updateUploadedWine(
    userId: number,
    wineId: number,
    updates: Partial<UploadedWine>
  ): Promise<UploadedWine>;

  // Optimized operations to prevent N+1 queries
  getUserCounts(
    userId: number
  ): Promise<{ savedWines: number; uploadedWines: number }>;

  // Recommendation history operations
  saveRecommendationHistory(
    history: InsertRecommendationHistory
  ): Promise<RecommendationHistory>;
  getRecommendationHistory(
    userId: number,
    limit?: number
  ): Promise<RecommendationHistory[]>;

  // Email signup operations
  saveEmailSignup(email: string): Promise<EmailSignup>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    if (!db) return undefined;
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    return rows[0];
  }

  async getUser(userId: number): Promise<User | undefined> {
    if (!db) return undefined;
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return rows[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');

    try {
      // First, try to find existing user by ID
      const existingUser = await this.getUserByClerkId(userData.clerkId);

      if (existingUser) {
        // User exists, update them
        const [user] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkId, userData.clerkId))
          .returning();
        return user;
      } else {
        // User doesn't exist, try to insert
        // But first check if email already exists
        if (userData.email) {
          const existingUserByEmail = await db
            .select()
            .from(users)
            .where(eq(users.email, userData.email))
            .limit(1);

          if (existingUserByEmail.length > 0) {
            // Email exists, update that user instead
            const [user] = await db
              .update(users)
              .set({
                ...userData,
                updatedAt: new Date(),
              })
              .where(eq(users.email, userData.email))
              .returning();
            return user;
          }
        }

        // No conflicts, safe to insert
        const [user] = await db.insert(users).values(userData).returning();
        return user;
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(userData: UpdateUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.clerkId, userData.clerkId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(
    userId: number,
    stripeCustomerId: string,
    stripeSubscriptionId: string | null
  ): Promise<User> {
    const updateData: any = {
      stripeCustomerId,
      updatedAt: new Date(),
    };
    if (stripeSubscriptionId) {
      updateData.stripeSubscriptionId = stripeSubscriptionId;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscriptionPlan(
    userId: number,
    subscriptionPlan: string
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionPlan,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserProfile(
    userId: number,
    profileData: {
      dateOfBirth?: string;
      wineExperienceLevel?: string;
      preferredWineTypes?: string[];
      budgetRange?: string;
      location?: string;
    }
  ): Promise<User> {
    try {
      console.log('Storage - updating user profile:', { userId, profileData });

      // Ensure database connection exists
      if (!db) {
        throw new Error('Database connection not available');
      }

      const [user] = await db
        .update(users)
        .set({
          dateOfBirth: profileData.dateOfBirth,
          wineExperienceLevel: profileData.wineExperienceLevel,
          preferredWineTypes: profileData.preferredWineTypes,
          budgetRange: profileData.budgetRange,
          location: profileData.location,
          profileCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!user) {
        throw new Error('User not found or update failed');
      }

      console.log('Storage - user profile updated successfully:', user);
      return user;
    } catch (error) {
      console.error('Storage - error updating user profile:', error);
      throw new Error(
        `Profile update failed: ${
          (error as Error)?.message || 'Unknown database error'
        }`
      );
    }
  }

  // Saved wines operations
  async getSavedWines(userId: number): Promise<SavedWine[]> {
    return await db
      .select()
      .from(savedWines)
      .where(eq(savedWines.userId, userId))
      .orderBy(desc(savedWines.createdAt));
  }

  async getSavedWineCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(savedWines)
      .where(eq(savedWines.userId, userId));
    return result.count;
  }

  async saveWine(wine: InsertSavedWine): Promise<SavedWine> {
    const [savedWine] = await db.insert(savedWines).values(wine).returning();
    return savedWine;
  }

  async removeSavedWine(userId: number, wineId: number): Promise<void> {
    await db.delete(savedWines).where(eq(savedWines.id, wineId));
  }

  // Uploaded wines operations
  async getUploadedWines(userId: number): Promise<UploadedWine[]> {
    return await db
      .select()
      .from(uploadedWines)
      .where(eq(uploadedWines.userId, userId))
      .orderBy(desc(uploadedWines.createdAt));
  }

  async getUploadedWineCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(uploadedWines)
      .where(eq(uploadedWines.userId, userId));
    return result.count;
  }

  // Optimized method to get both counts in a single query
  async getUserCounts(
    userId: number
  ): Promise<{ savedWines: number; uploadedWines: number }> {
    const savedWineQuery = db
      .select({ count: count() })
      .from(savedWines)
      .where(eq(savedWines.userId, userId));

    const uploadedWineQuery = db
      .select({ count: count() })
      .from(uploadedWines)
      .where(eq(uploadedWines.userId, userId));

    const [savedResult, uploadedResult] = await Promise.all([
      savedWineQuery,
      uploadedWineQuery,
    ]);

    return {
      savedWines: savedResult[0].count,
      uploadedWines: uploadedResult[0].count,
    };
  }

  async saveUploadedWine(wine: InsertUploadedWine): Promise<UploadedWine> {
    const [uploadedWine] = await db
      .insert(uploadedWines)
      .values(wine)
      .returning();
    return uploadedWine;
  }

  async updateUploadedWine(
    userId: number,
    wineId: number,
    updates: Partial<UploadedWine>
  ): Promise<UploadedWine> {
    const [updatedWine] = await db
      .update(uploadedWines)
      .set(updates)
      .where(eq(uploadedWines.id, wineId))
      .returning();
    return updatedWine;
  }

  // Recommendation history operations
  async saveRecommendationHistory(
    history: InsertRecommendationHistory
  ): Promise<RecommendationHistory> {
    const [savedHistory] = await db
      .insert(recommendationHistory)
      .values(history)
      .returning();
    return savedHistory;
  }

  async getRecommendationHistory(
    userId: number,
    limit = 10
  ): Promise<RecommendationHistory[]> {
    return await db
      .select()
      .from(recommendationHistory)
      .where(eq(recommendationHistory.userId, userId))
      .orderBy(desc(recommendationHistory.createdAt))
      .limit(limit);
  }

  async saveEmailSignup(email: string): Promise<EmailSignup> {
    if (!db) {
      throw new Error('Database not available');
    }

    try {
      // Use onConflictDoUpdate to handle duplicates gracefully
      const [emailSignup] = await db
        .insert(emailSignups)
        .values({ email })
        .onConflictDoUpdate({
          target: emailSignups.email,
          set: { email: email },
        })
        .returning();

      return emailSignup;
    } catch (error: any) {
      console.error('Database error in saveEmailSignup:', error.message);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
