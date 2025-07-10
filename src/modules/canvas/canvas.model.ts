import { cuid2 } from "drizzle-cuid2/postgres"
import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { users } from "../user/user.model"

export const canvases = pgTable("canvases", {
	...baseFields,
	userId: cuid2("user_id")
		.notNull()
		.references(() => users.id),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	// slug is irrelevant until we publish the canvas - so it can be null
	slug: varchar("slug", { length: 255 }).unique(),
	published: boolean("published").notNull().default(false),
})

export type Canvas = typeof canvases.$inferSelect
export type CanvasInsert = typeof canvases.$inferInsert
