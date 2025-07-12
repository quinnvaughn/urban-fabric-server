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
			resolve: (canvas, _args, { loaders }) => {
				return loaders.user.load(canvas.userId)
			},
		}),
		scenarios: t.field({
			type: ["Scenario"],
			resolve: (canvas, _args, { loaders }) => {
				return loaders.scenario.byCanvasId.load(canvas.id)
			},
		}),
	}),
})
