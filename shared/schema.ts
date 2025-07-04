import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  'sessions',
  {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
  },
  table => [index('IDX_session_expire').on(table.expire)]
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique(),
  clerkId: varchar('clerk_id').unique(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  subscriptionPlan: varchar('subscription_plan').default('free'), // "free" or "premium"
  stripeCustomerId: varchar('stripe_customer_id'),
  stripeSubscriptionId: varchar('stripe_subscription_id'),
  dateOfBirth: timestamp('date_of_birth'),
  wineExperienceLevel: varchar('wine_experience_level'),
  preferredWineTypes: varchar('preferred_wine_types').array(),
  budgetRange: varchar('budget_range'),
  location: varchar('location'),
  profileCompleted: boolean('profile_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Saved wines table
export const savedWines = pgTable(
  'saved_wines',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    wineName: varchar('wine_name').notNull(),
    wineType: varchar('wine_type').notNull(),
    region: varchar('region'),
    vintage: varchar('vintage'),
    description: text('description'),
    priceRange: varchar('price_range'),
    abv: decimal('abv', { precision: 4, scale: 2 }),
    rating: decimal('rating', { precision: 3, scale: 1 }),
    imageUrl: varchar('image_url'),
    source: varchar('source').notNull(), // "recommendation" or "uploaded"
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => [index('IDX_saved_wines_user_id').on(table.userId)]
);

// Uploaded wines table
export const uploadedWines = pgTable(
  'uploaded_wines',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    originalImageUrl: varchar('original_image_url').notNull(),
    wineName: varchar('wine_name'),
    wineType: varchar('wine_type'),
    region: varchar('region'),
    vintage: varchar('vintage'),
    optimalDrinkingStart: varchar('optimal_drinking_start'),
    optimalDrinkingEnd: varchar('optimal_drinking_end'),
    peakYearsStart: varchar('peak_years_start'),
    peakYearsEnd: varchar('peak_years_end'),
    analysis: text('analysis'),
    estimatedValue: varchar('estimated_value'),
    abv: decimal('abv', { precision: 4, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => [index('IDX_uploaded_wines_user_id').on(table.userId)]
);

// Wine recommendations history
export const recommendationHistory = pgTable(
  'recommendation_history',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    query: text('query').notNull(),
    recommendations: jsonb('recommendations').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => [index('IDX_recommendation_history_user_id').on(table.userId)]
);

// Email signups for pre-launch
export const emailSignups = pgTable('email_signups', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  savedWines: many(savedWines),
  uploadedWines: many(uploadedWines),
  recommendationHistory: many(recommendationHistory),
}));

export const savedWinesRelations = relations(savedWines, ({ one }) => ({
  user: one(users, {
    fields: [savedWines.userId],
    references: [users.id],
  }),
}));

export const uploadedWinesRelations = relations(uploadedWines, ({ one }) => ({
  user: one(users, {
    fields: [uploadedWines.userId],
    references: [users.id],
  }),
}));

export const recommendationHistoryRelations = relations(
  recommendationHistory,
  ({ one }) => ({
    user: one(users, {
      fields: [recommendationHistory.userId],
      references: [users.id],
    }),
  })
);

// Insert schemas
export const insertUserSchema = createInsertSchema(users);

export const insertSavedWineSchema = createInsertSchema(savedWines);

export const insertUploadedWineSchema = createInsertSchema(uploadedWines);

export const insertRecommendationHistorySchema = createInsertSchema(
  recommendationHistory
);

export const insertEmailSignupSchema = createInsertSchema(emailSignups);

// Types
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type UpsertUser = Partial<User> & { id: number };
export type CreateUser = Partial<User> & { clerkId: string };
export type UpdateUser = Partial<User> & { clerkId: string };
export type SavedWine = typeof savedWines.$inferSelect;
export type InsertSavedWine = typeof savedWines.$inferInsert;
export type UploadedWine = typeof uploadedWines.$inferSelect;
export type InsertUploadedWine = typeof uploadedWines.$inferInsert;
export type RecommendationHistory = typeof recommendationHistory.$inferSelect;
export type InsertRecommendationHistory =
  typeof recommendationHistory.$inferInsert;
export type EmailSignup = typeof emailSignups.$inferSelect;
export type InsertEmailSignup = typeof emailSignups.$inferInsert;
