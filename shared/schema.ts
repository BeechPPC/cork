import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionPlan: varchar("subscription_plan").default("free"), // "free" or "premium"
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  dateOfBirth: varchar("date_of_birth"),
  wineExperienceLevel: varchar("wine_experience_level"),
  preferredWineTypes: varchar("preferred_wine_types").array(),
  budgetRange: varchar("budget_range"),
  location: varchar("location"),
  profileCompleted: boolean("profile_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved wines table
export const savedWines = pgTable("saved_wines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  wineName: varchar("wine_name").notNull(),
  wineType: varchar("wine_type").notNull(),
  region: varchar("region"),
  vintage: varchar("vintage"),
  description: text("description"),
  priceRange: varchar("price_range"),
  abv: varchar("abv"),
  rating: varchar("rating"),
  imageUrl: varchar("image_url"),
  source: varchar("source").notNull(), // "recommendation" or "uploaded"
  createdAt: timestamp("created_at").defaultNow(),
});

// Uploaded wines table
export const uploadedWines = pgTable("uploaded_wines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  originalImageUrl: varchar("original_image_url").notNull(),
  wineName: varchar("wine_name"),
  wineType: varchar("wine_type"),
  region: varchar("region"),
  vintage: varchar("vintage"),
  optimalDrinkingStart: varchar("optimal_drinking_start"),
  optimalDrinkingEnd: varchar("optimal_drinking_end"),
  peakYearsStart: varchar("peak_years_start"),
  peakYearsEnd: varchar("peak_years_end"),
  analysis: text("analysis"),
  estimatedValue: varchar("estimated_value"),
  abv: varchar("abv"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wine recommendations history
export const recommendationHistory = pgTable("recommendation_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  query: text("query").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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

export const recommendationHistoryRelations = relations(recommendationHistory, ({ one }) => ({
  user: one(users, {
    fields: [recommendationHistory.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavedWineSchema = createInsertSchema(savedWines).omit({
  id: true,
  createdAt: true,
});

export const insertUploadedWineSchema = createInsertSchema(uploadedWines).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationHistorySchema = createInsertSchema(recommendationHistory).omit({
  id: true,
  createdAt: true,
});

export const insertEmailSignupSchema = createInsertSchema(emailSignups).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type SavedWine = typeof savedWines.$inferSelect;
export type InsertSavedWine = z.infer<typeof insertSavedWineSchema>;
export type UploadedWine = typeof uploadedWines.$inferSelect;
export type InsertUploadedWine = z.infer<typeof insertUploadedWineSchema>;
export type RecommendationHistory = typeof recommendationHistory.$inferSelect;
export type InsertRecommendationHistory = z.infer<typeof insertRecommendationHistorySchema>;
export type EmailSignup = typeof emailSignups.$inferSelect;
export type InsertEmailSignup = z.infer<typeof insertEmailSignupSchema>;
