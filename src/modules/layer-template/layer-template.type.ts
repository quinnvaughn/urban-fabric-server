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
			type: InteractionConfig,
			resolve: (layerTemplate) => layerTemplate.interactionConfig as any,
		}),
	}),
})

const InteractionConfig = builder.simpleObject("InteractionConfig", {
	fields: (t) => ({
		toolType: t.string(),
		defaultCursor: t.string(),
		validCursor: t.string(),
		invalidCursor: t.string(),
		validTargetLayers: t.stringList(),
		hoverStyle: t.field({ type: "JSON" }),
		activeStyle: t.field({ type: "JSON" }),
		featureFilter: t.field({ type: FeatureFilter, nullable: true }),
	}),
})

const FeatureFilter = builder.simpleObject("FeatureFilter", {
	fields: (t) => ({
		excludeClasses: t.stringList({ nullable: true }),
		includeClasses: t.stringList({ nullable: true }),
	}),
})
