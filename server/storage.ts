import {
  users,
  savedWines,
  uploadedWines,
  recommendationHistory,
  emailSignups,
  type User,
  type UpsertUser,
  type SavedWine,
  type InsertSavedWine,
  type UploadedWine,
  type InsertUploadedWine,
  type RecommendationHistory,
  type InsertRecommendationHistory,
  type EmailSignup,
} from "@shared/schema";
import { db } from "./db.js";
import { eq, desc, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string | null): Promise<User>;
  updateUserSubscriptionPlan(userId: string, subscriptionPlan: string): Promise<User>;
  updateUserProfile(userId: string, profileData: {
    dateOfBirth?: string;
    wineExperienceLevel?: string;
    preferredWineTypes?: string[];
    budgetRange?: string;
    location?: string;
  }): Promise<User>;
  
  // Saved wines operations
  getSavedWines(userId: string): Promise<SavedWine[]>;
  getSavedWineCount(userId: string): Promise<number>;
  saveWine(wine: InsertSavedWine): Promise<SavedWine>;
  removeSavedWine(userId: string, wineId: number): Promise<void>;
  
  // Uploaded wines operations
  getUploadedWines(userId: string): Promise<UploadedWine[]>;
  getUploadedWineCount(userId: string): Promise<number>;
  saveUploadedWine(wine: InsertUploadedWine): Promise<UploadedWine>;
  updateUploadedWine(userId: string, wineId: number, updates: Partial<UploadedWine>): Promise<UploadedWine>;
  
  // Recommendation history operations
  saveRecommendationHistory(history: InsertRecommendationHistory): Promise<RecommendationHistory>;
  getRecommendationHistory(userId: string, limit?: number): Promise<RecommendationHistory[]>;
  
  // Email signup operations
  saveEmailSignup(email: string): Promise<EmailSignup>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    if (!db) return undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string | null): Promise<User> {
    const updateData: any = { 
      stripeCustomerId,
      updatedAt: new Date()
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

  async updateUserSubscriptionPlan(userId: string, subscriptionPlan: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionPlan,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  async updateUserProfile(userId: string, profileData: {
    dateOfBirth?: string;
    wineExperienceLevel?: string;
    preferredWineTypes?: string[];
    budgetRange?: string;
    location?: string;
  }): Promise<User> {
    try {
      console.log("Storage - updating user profile:", { userId, profileData });
      
      // Ensure database connection exists
      if (!db) {
        throw new Error("Database connection not available");
      }
      
      const [user] = await db
        .update(users)
        .set({ 
          dateOfBirth: profileData.dateOfBirth,
          wineExperienceLevel: profileData.wineExperienceLevel,
          preferredWineTypes: profileData.preferredWineTypes,
          budgetRange: profileData.budgetRange,
          location: profileData.location,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();
      
      if (!user) {
        throw new Error("User not found or update failed");
      }
      
      console.log("Storage - user profile updated successfully:", user);
      return user;
    } catch (error) {
      console.error("Storage - error updating user profile:", error);
      throw new Error(`Profile update failed: ${error?.message || 'Unknown database error'}`);
    }
  }

  // Saved wines operations
  async getSavedWines(userId: string): Promise<SavedWine[]> {
    return await db
      .select()
      .from(savedWines)
      .where(eq(savedWines.userId, userId))
      .orderBy(desc(savedWines.createdAt));
  }

  async getSavedWineCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(savedWines)
      .where(eq(savedWines.userId, userId));
    return result.count;
  }

  async saveWine(wine: InsertSavedWine): Promise<SavedWine> {
    const [savedWine] = await db
      .insert(savedWines)
      .values(wine)
      .returning();
    return savedWine;
  }

  async removeSavedWine(userId: string, wineId: number): Promise<void> {
    await db
      .delete(savedWines)
      .where(eq(savedWines.id, wineId));
  }

  // Uploaded wines operations
  async getUploadedWines(userId: string): Promise<UploadedWine[]> {
    return await db
      .select()
      .from(uploadedWines)
      .where(eq(uploadedWines.userId, userId))
      .orderBy(desc(uploadedWines.createdAt));
  }

  async getUploadedWineCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(uploadedWines)
      .where(eq(uploadedWines.userId, userId));
    return result.count;
  }

  async saveUploadedWine(wine: InsertUploadedWine): Promise<UploadedWine> {
    const [uploadedWine] = await db
      .insert(uploadedWines)
      .values(wine)
      .returning();
    return uploadedWine;
  }

  async updateUploadedWine(userId: string, wineId: number, updates: Partial<UploadedWine>): Promise<UploadedWine> {
    const [updatedWine] = await db
      .update(uploadedWines)
      .set(updates)
      .where(eq(uploadedWines.id, wineId))
      .returning();
    return updatedWine;
  }

  // Recommendation history operations
  async saveRecommendationHistory(history: InsertRecommendationHistory): Promise<RecommendationHistory> {
    const [savedHistory] = await db
      .insert(recommendationHistory)
      .values(history)
      .returning();
    return savedHistory;
  }

  async getRecommendationHistory(userId: string, limit = 10): Promise<RecommendationHistory[]> {
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
          set: { email: email }
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
