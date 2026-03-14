import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
	boolean,
	doublePrecision,
	geometry,
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { fabrics } from "../fabric/fabric.model"
import { users } from "../user/user.model"

export const proposals = pgTable(
	"proposals",
	{
		...baseFields,
		fabricId: uuid("fabric_id")
			.notNull()
			.references(() => fabrics.id),
		creatorId: uuid("creator_id")
			.notNull()
			.references(() => users.id),
		title: text("title").notNull(),
		description: text("description"),
		slug: text("slug").notNull().unique(),
		isPublished: boolean("is_published").notNull().default(false),
		publishedAt: timestamp("published_at"),
		// snapshot of fabric state at publish time
		snapshotElements: jsonb("snapshot_elements"),
		snapshotCenter: geometry("snapshot_center", {
			type: "point",
			mode: "tuple",
			srid: 4326,
		}),
		snapshotZoom: doublePrecision("snapshot_zoom"),
		snapshotThumbnail: text("snapshot_thumbnail"),
		snapshotLocationCity: text("snapshot_location_city"),
		snapshotLocationRegion: text("snapshot_location_region"),
		snapshotLocationCountry: text("snapshot_location_country"),
	},
	(t) => [
		index("proposals_fabric_id_idx").on(t.fabricId),
		index("proposals_creator_id_idx").on(t.creatorId),
		index("proposals_fabric_id_is_published_idx").on(t.fabricId, t.isPublished),
	],
)

export type Proposal = InferSelectModel<typeof proposals>
export type ProposalInsert = InferInsertModel<typeof proposals>
