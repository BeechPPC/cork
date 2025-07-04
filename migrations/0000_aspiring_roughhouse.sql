CREATE TABLE "email_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "recommendation_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"query" text NOT NULL,
	"recommendations" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_wines" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"wine_name" varchar NOT NULL,
	"wine_type" varchar NOT NULL,
	"region" varchar,
	"vintage" varchar,
	"description" text,
	"price_range" varchar,
	"abv" numeric(4, 2),
	"rating" numeric(3, 1),
	"image_url" varchar,
	"source" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_wines" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"original_image_url" varchar NOT NULL,
	"wine_name" varchar,
	"wine_type" varchar,
	"region" varchar,
	"vintage" varchar,
	"optimal_drinking_start" varchar,
	"optimal_drinking_end" varchar,
	"peak_years_start" varchar,
	"peak_years_end" varchar,
	"analysis" text,
	"estimated_value" varchar,
	"abv" numeric(4, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"clerk_id" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"subscription_plan" varchar DEFAULT 'free',
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"date_of_birth" timestamp,
	"wine_experience_level" varchar,
	"preferred_wine_types" varchar[],
	"budget_range" varchar,
	"location" varchar,
	"profile_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "recommendation_history" ADD CONSTRAINT "recommendation_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_wines" ADD CONSTRAINT "saved_wines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_wines" ADD CONSTRAINT "uploaded_wines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_recommendation_history_user_id" ON "recommendation_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_saved_wines_user_id" ON "saved_wines" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "IDX_uploaded_wines_user_id" ON "uploaded_wines" USING btree ("user_id");