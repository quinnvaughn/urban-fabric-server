import { cuid2 } from "drizzle-cuid2/postgres"
import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { scenarios } from "../scenario/scenario.model"

export const scenarioFeatures = pgTable("scenario_features", {
	...baseFields,
	scenarioId: cuid2("scenario_id")
		.notNull()
		.references(() => scenarios.id),
	type: varchar("type", { length: 64 }).notNull(),
	geometry: jsonb("geometry").notNull(),
	properties: jsonb("properties").notNull().default("{}"),
})

export type ScenarioFeature = typeof scenarioFeatures.$inferSelect
export type ScenarioFeatureInsert = typeof scenarioFeatures.$inferInsert
