import { cuid2 } from "drizzle-cuid2/postgres"
import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { featureOptions } from "../feature-option/feature-option.model"
import { scenarios } from "../scenario/scenario.model"

export const features = pgTable("features", {
	...baseFields,
	scenarioId: cuid2("scenario_id")
		.notNull()
		.references(() => scenarios.id),
	geometry: jsonb("geometry").notNull(),
	properties: jsonb("properties").notNull().default("{}"),
	optionId: varchar("option_id", { length: 64 }).references(
		() => featureOptions.id,
		{ onDelete: "cascade" },
	),
})

export type Feature = typeof features.$inferSelect
export type FeatureInsert = typeof features.$inferInsert
