import { match } from "ts-pattern"
import { builder } from "../../graphql/builder"
import type { LayerInstance as LayerInstanceRow } from "./layer-instance.model"

abstract class LayerInstance implements LayerInstanceRow {
	id!: string
	createdAt!: Date
	updatedAt!: Date
	scenarioId!: string
	geometry!: GeoJSON.Geometry
	templateId!: string
	// biome-ignore lint/suspicious/noExplicitAny: We need to allow any here for flexibility
	properties!: Record<string, any>
}

builder.interfaceType("LayerInstance", {
	fields: (t) => ({
		id: t.exposeID("id"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		geometry: t.field({
			type: "GeoJSON",
			resolve: (layerInstance) => layerInstance.geometry as GeoJSON.Geometry,
		}),
	}),
	resolveType: (layerInstance) => {
		return match(layerInstance.templateId)
			.with("bike_lane", () => "BikeLaneLayerInstance")
			.otherwise(() => "UnknownLayerInstance")
	},
})

class BikeLaneLayerInstance extends LayerInstance {
	properties!: {
		width: number
		buffer: string
		curbSide: boolean
		parkingAdjacent: boolean
		gradeSeparated: boolean
		connectsTo: string[]
		oneWay: boolean
	}
}

builder.objectType(BikeLaneLayerInstance, {
	name: "BikeLaneLayerInstance",
	interfaces: ["LayerInstance"],
	fields: (t) => ({
		id: t.exposeID("id"),
		createdAt: t.field({ type: "DateTime", resolve: (f) => f.createdAt }),
		updatedAt: t.field({ type: "DateTime", resolve: (f) => f.updatedAt }),
		geometry: t.field({
			type: "GeoJSON",
			resolve: (f) => f.geometry,
		}),
		width: t.float({ resolve: (f) => f.properties.width }),
		buffer: t.string({ resolve: (f) => f.properties.buffer }),
		curbSide: t.boolean({ resolve: (f) => f.properties.curbSide }),
		oneWay: t.boolean({ resolve: (f) => f.properties.oneWay }),
		parkingAdjacent: t.boolean({
			resolve: (f) => f.properties.parkingAdjacent,
		}),
		gradeSeparated: t.boolean({ resolve: (f) => f.properties.gradeSeparated }),
		connectsTo: t.stringList({
			resolve: (f) => f.properties.connectsTo ?? [],
		}),
		scenario: t.field({
			type: "Scenario",
			resolve: async (layerInstance, _args, { loaders }) => {
				const scenario = await loaders.scenario.byId.load(
					layerInstance.scenarioId,
				)
				if (!scenario) throw new Error("Scenario not found")
				return scenario
			},
		}),
		option: t.field({
			type: "LayerTemplate",
			resolve: async (layerInstance, _args, { loaders }) => {
				const option = await loaders.layerTemplate.byId.load(
					layerInstance.templateId,
				)
				if (!option) throw new Error("LayerInstance option not found")
				return option
			},
		}),
	}),
})
