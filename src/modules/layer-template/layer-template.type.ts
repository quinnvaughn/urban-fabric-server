import { builder } from "../../graphql/builder"
import { geometryTypes } from "./geometry-type.model"

export const GeometryType = builder.enumType("GeometryType", {
	values: geometryTypes,
})

builder.objectType("LayerTemplate", {
	fields: (t) => ({
		id: t.exposeID("id"),
		label: t.exposeString("label"),
		icon: t.exposeString("icon", { nullable: true }),
		description: t.exposeString("description", { nullable: true }),
		geometryType: t.field({
			type: GeometryType,
			resolve: (layerTemplate) => layerTemplate.geometryType,
		}),
		propertiesSchema: t.field({
			type: "JSON",
			resolve: (layerTemplate) => layerTemplate.propertiesSchema as any,
		}),
		interactionConfig: t.field({
			type: "JSON",
			resolve: (layerTemplate) => layerTemplate.interactionConfig as any,
		}),
	}),
})
