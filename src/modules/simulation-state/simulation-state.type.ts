import { builder } from "../../graphql/builder"

builder.objectType("SimulationState", {
	fields: (t) => ({
		id: t.exposeID("id"),
		lastViewedScenarioId: t.exposeID("lastViewedScenarioId"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		user: t.field({
			type: "User",
			resolve: async (state, _args, { loaders }) => {
				const user = await loaders.user.load(state.userId)
				if (!user) throw new Error("User not found")
				return user
			},
		}),
		lastOpenedAt: t.expose("lastOpenedAt", { type: "DateTime" }),
		simulation: t.field({
			type: "Simulation",
			resolve: async (state, _args, { loaders }) => {
				const simulation = await loaders.simulation.byId.load(
					state.simulationId,
				)
				if (!simulation) throw new Error("Simulation not found")
				return simulation
			},
		}),
	}),
})
