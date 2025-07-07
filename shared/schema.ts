import { z } from 'zod';

// Simple TypeScript interfaces for Firebase Firestore
export interface User {
  id: string;
  email: string;
  firebaseId: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  subscriptionPlan: 'free' | 'premium';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  dateOfBirth?: string;
  wineExperienceLevel?: string;
  preferredWineTypes?: string[];
  budgetRange?: string;
  location?: string;
  profileCompleted: boolean;
  usage?: {
    savedWines: number;
    uploadedWines: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SavedWine {
  id: string;
  userId: string;
  wineName: string;
  wineType: string;
  region?: string;
  vintage?: string;
  description?: string;
  priceRange?: string;
  abv?: number;
  rating?: number;
  imageUrl?: string;
  source: 'recommendation' | 'uploaded';
  createdAt: string;
}

export interface UploadedWine {
  id: string;
  userId: string;
  originalImageUrl: string;
  wineName?: string;
  wineType?: string;
  region?: string;
  vintage?: string;
  optimalDrinkingStart?: string;
  optimalDrinkingEnd?: string;
  peakYearsStart?: string;
  peakYearsEnd?: string;
  analysis?: string;
  estimatedValue?: string;
  abv?: number;
  createdAt: string;
}

export interface RecommendationHistory {
  id: string;
  userId: string;
  query: string;
  recommendations: any[];
  createdAt: string;
}

export interface EmailSignup {
  id: string;
  email: string;
  createdAt: string;
}

// Zod schemas for validation
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firebaseId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  subscriptionPlan: z.enum(['free', 'premium']),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  wineExperienceLevel: z.string().optional(),
  preferredWineTypes: z.array(z.string()).optional(),
  budgetRange: z.string().optional(),
  location: z.string().optional(),
  profileCompleted: z.boolean(),
  usage: z
    .object({
      savedWines: z.number(),
      uploadedWines: z.number(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const savedWineSchema = z.object({
  id: z.string(),
  userId: z.string(),
  wineName: z.string(),
  wineType: z.string(),
  region: z.string().optional(),
  vintage: z.string().optional(),
  description: z.string().optional(),
  priceRange: z.string().optional(),
  abv: z.number().optional(),
  rating: z.number().optional(),
  imageUrl: z.string().optional(),
  source: z.enum(['recommendation', 'uploaded']),
  createdAt: z.string(),
});

export const uploadedWineSchema = z.object({
  id: z.string(),
  userId: z.string(),
  originalImageUrl: z.string(),
  wineName: z.string().optional(),
  wineType: z.string().optional(),
  region: z.string().optional(),
  vintage: z.string().optional(),
  optimalDrinkingStart: z.string().optional(),
  optimalDrinkingEnd: z.string().optional(),
  peakYearsStart: z.string().optional(),
  peakYearsEnd: z.string().optional(),
  analysis: z.string().optional(),
  estimatedValue: z.string().optional(),
  abv: z.number().optional(),
  createdAt: z.string(),
});

export const recommendationHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  query: z.string(),
  recommendations: z.array(z.any()),
  createdAt: z.string(),
});

export const emailSignupSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});

// Insert schemas (for creating new records)
export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertSavedWineSchema = savedWineSchema.omit({
  id: true,
  createdAt: true,
});
export const insertUploadedWineSchema = uploadedWineSchema.omit({
  id: true,
  createdAt: true,
});
export const insertRecommendationHistorySchema =
  recommendationHistorySchema.omit({ id: true, createdAt: true });
export const insertEmailSignupSchema = emailSignupSchema.omit({
  id: true,
  createdAt: true,
});

// Types
export type UserInsert = z.infer<typeof insertUserSchema>;
export type UpsertUser = Partial<User> & { id: string };
export type CreateUser = Partial<User> & { firebaseId?: string };
export type UpdateUser = Partial<User> & { firebaseId?: string };
export type InsertSavedWine = z.infer<typeof insertSavedWineSchema>;
export type InsertUploadedWine = z.infer<typeof insertUploadedWineSchema>;
export type InsertRecommendationHistory = z.infer<
  typeof insertRecommendationHistorySchema
>;
export type InsertEmailSignup = z.infer<typeof insertEmailSignupSchema>;
