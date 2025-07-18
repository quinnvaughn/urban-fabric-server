import { cuid2 } from "drizzle-cuid2/postgres"
import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { layerTemplates } from "../layer-template/layer-template.model"
import { scenarios } from "../scenario/scenario.model"

export const layerInstances = pgTable("layer_instances", {
	...baseFields,
	scenarioId: cuid2("scenario_id")
		.notNull()
		.references(() => scenarios.id),
	geometry: jsonb("geometry").notNull(),
	properties: jsonb("properties").notNull().default("{}"),
	templateId: varchar("template_id", { length: 64 })
		.notNull()
		.references(() => layerTemplates.id, { onDelete: "cascade" }),
})

export type LayerInstance = typeof layerInstances.$inferSelect
export type LayerInstanceInsert = typeof layerInstances.$inferInsert
