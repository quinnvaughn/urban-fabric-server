import { builder } from "../../graphql/builder"

builder.objectType("Scenario", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		position: t.exposeInt("position"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		simulation: t.field({
			type: "Simulation",
			resolve: async (scenario, _args, { loaders }) => {
				const simulation = await loaders.simulation.byId.load(
					scenario.simulationId,
				)
				if (!simulation) throw new Error("Simulation not found")
				return simulation
			},
		}),
		layerInstances: t.field({
			type: ["LayerInstance"],
			resolve: async (scenario, _args, { loaders }) => {
				return await loaders.layerInstance.byScenarioId.load(scenario.id)
			},
		}),
	}),
})
