import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
	doublePrecision,
	geometry,
	index,
	jsonb,
	pgTable,
	text,
	uuid,
} from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { users } from "../user/user.model"

export const fabrics = pgTable(
	"fabrics",
	{
		...baseFields,
		creatorId: uuid("creator_id")
			.notNull()
			.references(() => users.id),
		changes: jsonb("changes").notNull().default([]),
		originCenter: geometry("origin_center", {
			type: "point",
			mode: "tuple",
			srid: 4326,
		}).notNull(),
		originZoom: doublePrecision("origin_zoom").notNull(),
		originPitch: doublePrecision("origin_pitch").notNull(),
		originBearing: doublePrecision("origin_bearing").notNull(),
		viewportCenter: geometry("viewport_center", {
			type: "point",
			mode: "tuple",
			srid: 4326,
		}).notNull(),
		viewportZoom: doublePrecision("viewport_zoom").notNull(),
		viewportPitch: doublePrecision("viewport_pitch").notNull(),
		viewportBearing: doublePrecision("viewport_bearing").notNull(),
		title: text("title").notNull().default("Untitled Fabric"),
	},
	(t) => [
		index("fabrics_creator_id_idx").on(t.creatorId),
		index("fabrics_origin_center_idx").using("gist", t.originCenter),
	],
)

export type Fabric = InferSelectModel<typeof fabrics>
// or for insert type (without required defaults):
export type FabricInsert = InferInsertModel<typeof fabrics>
