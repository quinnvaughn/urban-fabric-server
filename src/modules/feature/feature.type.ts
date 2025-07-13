import { match } from "ts-pattern"
import { builder } from "../../graphql/builder"
import type { Feature as FeatureRow } from "./feature.model"

abstract class Feature implements FeatureRow {
	id!: string
	createdAt!: Date
	updatedAt!: Date
	scenarioId!: string
	geometry!: GeoJSON.Geometry
	optionId!: string
	// biome-ignore lint/suspicious/noExplicitAny: We need to allow any here for flexibility
	properties!: Record<string, any>
}

builder.interfaceType("Feature", {
	fields: (t) => ({
		id: t.exposeID("id"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		geometry: t.field({
			type: "GeoJSON",
			resolve: (feature) => feature.geometry as GeoJSON.Geometry,
		}),
	}),
	resolveType: (feature) => {
		return match(feature.optionId)
			.with("bike_lane", () => "BikeLaneFeature")
			.otherwise(() => "UnknownFeature")
	},
})

class BikeLaneFeature extends Feature {
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

builder.objectType(BikeLaneFeature, {
	name: "BikeLaneFeature",
	interfaces: ["Feature"],
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
			resolve: async (feature, _args, { loaders }) => {
				const scenario = await loaders.scenario.byId.load(feature.scenarioId)
				if (!scenario) throw new Error("Scenario not found")
				return scenario
			},
		}),
		// TODO: Uncomment when feature options are implemented
		// option: t.field({
		// 	type: 'FeatureOption',
		// 	resolve: async (feature, _args, { loaders }) => {
		// 		if (!feature.optionId) return null
		// 		const option = await loaders.featureOption.byId.load(feature.optionId)
		// 		if (!option) throw new Error("Feature option not found")
		// 		return option
		// 	}
		// })
	}),
})
