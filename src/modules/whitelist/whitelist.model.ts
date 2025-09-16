import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { pgTable, varchar } from "drizzle-orm/pg-core"

export const whitelists = pgTable("whitelists", {
	email: varchar("email", { length: 255 }).notNull().unique().primaryKey(),
})
export type Whitelist = InferSelectModel<typeof whitelists>

export type NewWhitelist = InferInsertModel<typeof whitelists>
