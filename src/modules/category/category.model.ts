import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
	id: varchar("id", { length: 64 }).primaryKey(), // "streets", "buildings"
	label: text("label").notNull(), // "Streets", "Buildings"
	icon: varchar("icon", { length: 64 }), // Optional UI hook
	order: integer("order"), // For UI sort order
})

export type Category = typeof categories.$inferSelect
export type CategoryInsert = typeof categories.$inferInsert
