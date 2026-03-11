ALTER TABLE "sessions" ALTER COLUMN "sid" SET DATA TYPE text USING "sid"::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text USING "email"::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DATA TYPE text USING "hashed_password"::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text USING "name"::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text USING "role"::text;