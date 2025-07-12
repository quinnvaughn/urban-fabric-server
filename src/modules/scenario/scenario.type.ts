import { builder } from "../../graphql/builder"

builder.objectType("Scenario", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		position: t.exposeInt("position"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		canvas: t.field({
			type: "Canvas",
			resolve: (scenario, _args, { loaders }) => {
				return loaders.canvas.byId.load(scenario.canvasId)
			},
		}),
		features: t.field({
			type: ["ScenarioFeature"],
			resolve: (scenario, _args, { loaders }) => {
				return loaders.scenarioFeature.byId.load(scenario.id)
			},
		}),
	}),
})
