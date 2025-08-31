import { builder } from "../../graphql/builder"

builder.objectType("User", {
	fields: (t) => ({
		id: t.exposeID("id"),
		email: t.exposeString("email"),
		name: t.exposeString("name", { nullable: true }),
		role: t.exposeString("role"),
		simulations: t.field({
			type: ["Simulation"],
			resolve: async (user, _args, { loaders }) => {
				if (!user.id) return []
				return loaders.simulation.byUserId.load(user.id)
			},
		}),
	}),
})
