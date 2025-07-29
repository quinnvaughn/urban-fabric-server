import { cuid2 } from "drizzle-cuid2/postgres"
import { pgTable, timestamp } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { simulations } from "../simulation/simulation.model"
import { users } from "../user/user.model"

// holds the state of a simulation for a user
// this is used to track which scenario the user last viewed
// in a shared simulation, viewers might not want to see the same scenario
export const simulationState = pgTable("simulation_state", {
	...baseFields,
	simulationId: cuid2("simulation_id")
		.references(() => simulations.id, { onDelete: "cascade" })
		.notNull(),
	userId: cuid2("user_id")
		.references(() => users.id)
		.notNull(),
	lastViewedScenarioId: cuid2("last_viewed_scenario_id").notNull(),
	lastOpenedAt: timestamp("last_opened_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
})

export type SimulationState = typeof simulationState.$inferSelect
export type SimulationStateInsert = typeof simulationState.$inferInsert
