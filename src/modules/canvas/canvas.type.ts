import { builder } from "../../graphql/builder"

builder.objectType("Canvas", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		description: t.exposeString("description", { nullable: true }),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
		slug: t.exposeString("slug", { nullable: true }),
		published: t.exposeBoolean("published"),
		author: t.field({
			type: "User",
			resolve: async (canvas, _args, { loaders }) => {
				const author = await loaders.user.load(canvas.userId)
				if (!author) throw new Error("Author not found")
				return author
			},
		}),
		scenarios: t.field({
			type: ["Scenario"],
			resolve: async (canvas, _args, { loaders }) => {
				const scenarios = await loaders.scenario.byCanvasId.load(canvas.id)
				if (!scenarios) throw new Error("Scenarios not found")
				return scenarios
			},
		}),
	}),
})
