import { cuid2 } from "drizzle-cuid2/postgres"
import { timestamp } from "drizzle-orm/pg-core"

export const baseFields = {
	id: cuid2("id").defaultRandom().primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
}
