CREATE TABLE "sessions" (
	"sid" varchar(255) PRIMARY KEY,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"hashed_password" varchar(255) NOT NULL,
	"name" varchar(100),
	"role" varchar(50) DEFAULT 'user' NOT NULL
);
