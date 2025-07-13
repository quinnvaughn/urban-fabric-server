import { match } from "ts-pattern"
import { builder } from "../../graphql/builder"

abstract class ScenarioFeature {
	id!: string
	createdAt!: Date
	updatedAt!: Date
	scenarioId!: string
	type!: string
	geometry!: GeoJSON.Geometry
}

builder.interfaceType("ScenarioFeature", {
	fields: (t) => ({
		id: t.exposeID("id"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		scenarioId: t.exposeID("scenarioId"),
		type: t.exposeString("type"),
		geometry: t.field({
			type: "GeoJSON",
			resolve: (feature) => feature.geometry as GeoJSON.Geometry,
		}),
	}),
	resolveType: (feature) => {
		return match(feature.type)
			.with("bike_lane", () => "BikeLaneFeature")
			.otherwise(() => "UnknownFeature")
	},
})

class BikeLaneFeature extends ScenarioFeature {
	properties!: {
		width: number
		buffer: string
		curbSide: boolean
		parkingAdjacent: boolean
		gradeSeparated: boolean
		connectsTo: string[]
	}
}

builder.objectType(BikeLaneFeature, {
	name: "BikeLaneFeature",
	interfaces: ["ScenarioFeature"],
	fields: (t) => ({
		id: t.exposeID("id"),
		createdAt: t.field({ type: "DateTime", resolve: (f) => f.createdAt }),
		updatedAt: t.field({ type: "DateTime", resolve: (f) => f.updatedAt }),
		type: t.exposeString("type"),
		geometry: t.field({
			type: "GeoJSON",
			resolve: (f) => f.geometry,
		}),
		width: t.float({ resolve: (f) => f.properties.width }),
		buffer: t.string({ resolve: (f) => f.properties.buffer }),
		curbSide: t.boolean({ resolve: (f) => f.properties.curbSide }),
		parkingAdjacent: t.boolean({
			resolve: (f) => f.properties.parkingAdjacent,
		}),
		gradeSeparated: t.boolean({ resolve: (f) => f.properties.gradeSeparated }),
		connectsTo: t.stringList({
			resolve: (f) => f.properties.connectsTo ?? [],
		}),
	}),
})
