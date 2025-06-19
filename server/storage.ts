import {
  users,
  savedWines,
  uploadedWines,
  recommendationHistory,
  type User,
  type UpsertUser,
  type SavedWine,
  type InsertSavedWine,
  type UploadedWine,
  type InsertUploadedWine,
  type RecommendationHistory,
  type InsertRecommendationHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string | null): Promise<User>;
  updateUserSubscriptionPlan(userId: string, subscriptionPlan: string): Promise<User>;
  
  // Saved wines operations
  getSavedWines(userId: string): Promise<SavedWine[]>;
  getSavedWineCount(userId: string): Promise<number>;
  saveWine(wine: InsertSavedWine): Promise<SavedWine>;
  removeSavedWine(userId: string, wineId: number): Promise<void>;
  
  // Uploaded wines operations
  getUploadedWines(userId: string): Promise<UploadedWine[]>;
  getUploadedWineCount(userId: string): Promise<number>;
  saveUploadedWine(wine: InsertUploadedWine): Promise<UploadedWine>;
  
  // Recommendation history operations
  saveRecommendationHistory(history: InsertRecommendationHistory): Promise<RecommendationHistory>;
  getRecommendationHistory(userId: string, limit?: number): Promise<RecommendationHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionPlan: "premium",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
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
}

export const storage = new DatabaseStorage();
