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
			resolve: async (scenario, _args, { loaders }) => {
				const canvas = await loaders.canvas.byId.load(scenario.canvasId)
				if (!canvas) throw new Error("Canvas not found")
				return canvas
			},
		}),
		features: t.field({
			type: ["Feature"],
			resolve: async (scenario, _args, { loaders }) => {
				return await loaders.feature.byScenarioId.load(scenario.id)
			},
		}),
	}),
})
