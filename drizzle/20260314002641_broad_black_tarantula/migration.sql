ALTER TABLE "fabrics" RENAME COLUMN "viewport_center" TO "center";--> statement-breakpoint
ALTER TABLE "fabrics" RENAME COLUMN "viewport_zoom" TO "zoom";--> statement-breakpoint
ALTER TABLE "fabrics" RENAME COLUMN "viewport_bearing" TO "bearing";--> statement-breakpoint
ALTER TABLE "fabrics" DROP COLUMN "origin_center";--> statement-breakpoint
ALTER TABLE "fabrics" DROP COLUMN "origin_zoom";--> statement-breakpoint
ALTER TABLE "fabrics" DROP COLUMN "origin_bearing";--> statement-breakpoint
DROP INDEX IF EXISTS "fabrics_origin_center_idx";--> statement-breakpoint
CREATE INDEX "fabrics_center_idx" ON "fabrics" USING gist ("center");