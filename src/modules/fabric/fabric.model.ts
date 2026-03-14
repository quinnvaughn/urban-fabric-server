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
		elements: jsonb("elements").notNull().default([]),
		center: geometry("center", {
			type: "point",
			mode: "tuple",
			srid: 4326,
		}).notNull(),
		zoom: doublePrecision("zoom").notNull(),
		thumbnail: text("thumbnail"),
		locationCity: text("location_city").notNull(),
		locationRegion: text("location_region").notNull(),
		locationCountry: text("location_country").notNull(),
		title: text("title").notNull().default("Untitled Fabric"),
	},
	(t) => [
		index("fabrics_creator_id_idx").on(t.creatorId),
		index("fabrics_center_idx").using("gist", t.center),
	],
)

export type Fabric = InferSelectModel<typeof fabrics>
// or for insert type (without required defaults):
export type FabricInsert = InferInsertModel<typeof fabrics>
