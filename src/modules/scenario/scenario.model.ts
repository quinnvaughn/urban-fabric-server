import { cuid2 } from "drizzle-cuid2/postgres"
import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"
import { canvases } from "../canvas/canvas.model"

export const scenarios = pgTable("scenarios", {
	...baseFields,
	canvasId: cuid2("canvas_id")
		.notNull()
		.references(() => canvases.id),
	name: varchar("name", { length: 255 }).notNull(),
	position: integer("position").notNull(),
})

export type Scenario = typeof scenarios.$inferSelect
export type ScenarioInsert = typeof scenarios.$inferInsert
