CREATE INDEX "fabrics_creator_id_idx" ON "fabrics" ("creator_id");--> statement-breakpoint
CREATE INDEX "fabrics_origin_center_idx" ON "fabrics" USING gist ("origin_center");--> statement-breakpoint
CREATE INDEX "proposals_fabric_id_idx" ON "proposals" ("fabric_id");--> statement-breakpoint
CREATE INDEX "proposals_creator_id_idx" ON "proposals" ("creator_id");--> statement-breakpoint
CREATE INDEX "proposals_fabric_id_is_published_idx" ON "proposals" ("fabric_id","is_published");