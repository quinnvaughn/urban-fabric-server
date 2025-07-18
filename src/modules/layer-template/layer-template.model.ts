import { jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { categories } from "../category/category.model"
import { geometryTypeEnum } from "./geometry-type.model"

export const layerTemplates = pgTable("layer_templates", {
	id: varchar("id", { length: 64 }).primaryKey(), // bike_lane, etc
	label: text("label").notNull(), // Bike Lane, etc
	description: text("description"),
	categoryId: varchar("category_id", { length: 64 })
		.notNull()
		.references(() => categories.id),
	geometryType: geometryTypeEnum("geometry_type").notNull(), // Point, LineString, etc
	propertiesSchema: jsonb("properties_schema"), // JSON schema for properties ie {"width": {"type": "number", "default": 2.0}}
	icon: varchar("icon", { length: 64 }), // optional icon name
})

export type LayerTemplate = typeof layerTemplates.$inferSelect
export type LayerTemplateInsert = typeof layerTemplates.$inferInsert
