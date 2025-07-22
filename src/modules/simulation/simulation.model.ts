import { cuid2 } from "drizzle-cuid2/postgres"
import { pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { users } from "../user/user.model"

export const simulations = pgTable("simulations", {
	...baseFields,
	userId: cuid2("user_id")
		.notNull()
		.references(() => users.id),
	name: varchar("name", { length: 255 }).notNull(),
	// TODO: narrativeId: cuid2("narrative_id")
})

export type Simulation = typeof simulations.$inferSelect
export type SimulationInsert = typeof simulations.$inferInsert
