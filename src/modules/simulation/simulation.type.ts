import { builder } from "../../graphql/builder"

builder.objectType("Simulation", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		author: t.field({
			type: "User",
			resolve: async (simulation, _args, { loaders }) => {
				const author = await loaders.user.load(simulation.userId)
				if (!author) throw new Error("Author not found")
				return author
			},
		}),
		scenarios: t.field({
			type: ["Scenario"],
			resolve: async (simulation, _args, { loaders }) => {
				const scenarios = await loaders.scenario.bySimulationId.load(
					simulation.id,
				)
				if (!scenarios) throw new Error("Scenarios not found")
				return scenarios
			},
		}),
		state: t.field({
			type: "SimulationState",
			resolve: async (simulation, _args, { loaders, user }) => {
				if (!user) throw new Error("User not authenticated")
				const state = await loaders.simulationState.byUserAndSimulationId.load({
					userId: user.id,
					simulationId: simulation.id,
				})
				if (!state) throw new Error("Simulation state not found")
				return state
			},
		}),
	}),
})
