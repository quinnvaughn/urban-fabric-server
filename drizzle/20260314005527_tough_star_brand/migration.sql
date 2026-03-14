CREATE INDEX IF NOT EXISTS "fabrics_center_idx" ON "fabrics" USING gist ("center");--> statement-breakpoint
ALTER TABLE "fabrics" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_elements" jsonb;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_center" geometry(point,4326);--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_zoom" double precision;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_bearing" double precision;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_thumbnail" text;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_location_city" text;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_location_region" text;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "snapshot_location_country" text;