CREATE TABLE "fabrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"creator_id" uuid NOT NULL,
	"changes" jsonb DEFAULT '[]' NOT NULL,
	"origin_center" geometry(point,4326) NOT NULL,
	"origin_zoom" double precision NOT NULL,
	"origin_pitch" double precision NOT NULL,
	"origin_bearing" double precision NOT NULL,
	"viewport_center" geometry(point,4326) NOT NULL,
	"viewport_zoom" double precision NOT NULL,
	"viewport_pitch" double precision NOT NULL,
	"viewport_bearing" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"fabric_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slug" text NOT NULL UNIQUE,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "fabrics" ADD CONSTRAINT "fabrics_creator_id_users_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_fabric_id_fabrics_id_fkey" FOREIGN KEY ("fabric_id") REFERENCES "fabrics"("id");--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_creator_id_users_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id");