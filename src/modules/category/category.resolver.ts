import { builder } from "../../graphql/builder"
import { NotFoundError } from "../error"

builder.queryFields((t) => ({
	category: t.field({
		type: "Category",
		errors: {
			types: [NotFoundError],
		},
		args: {
			id: t.arg.id(),
		},
		resolve: async (_parent, { id }, { services }) => {
			const category = await services.category.findById(id)
			if (!category) {
				throw new NotFoundError(`Category with ${id} not found`)
			}
			return category
		},
	}),
	categories: t.field({
		type: ["Category"],
		resolve: async (_parent, _args, { services }) => {
			return services.category.findAll()
		},
	}),
}))
