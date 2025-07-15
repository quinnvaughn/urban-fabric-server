import { cuid2 } from "drizzle-cuid2/postgres"
import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { simulations } from "../simulation/simulation.model"

export const scenarios = pgTable("scenarios", {
	...baseFields,
	simulationId: cuid2("simulation_id")
		.notNull()
		.references(() => simulations.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	position: integer("position").notNull(),
})

export type Scenario = typeof scenarios.$inferSelect
export type ScenarioInsert = typeof scenarios.$inferInsert
