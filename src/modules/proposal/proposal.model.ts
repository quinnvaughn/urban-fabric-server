import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
	boolean,
	index,
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
	},
	(t) => [
		index("proposals_fabric_id_idx").on(t.fabricId),
		index("proposals_creator_id_idx").on(t.creatorId),
		index("proposals_fabric_id_is_published_idx").on(t.fabricId, t.isPublished),
	],
)

export type Proposal = InferSelectModel<typeof proposals>
// or for insert type (without required defaults):
export type ProposalInsert = InferInsertModel<typeof proposals>
