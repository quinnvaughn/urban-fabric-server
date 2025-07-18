import { builder } from "../../graphql/builder"
import { NotFoundError } from "../error"

builder.queryFields((t) => ({
	layerTemplate: t.field({
		type: "LayerTemplate",
		errors: {
			types: [NotFoundError],
		},
		args: {
			id: t.arg.id(),
		},
		resolve: async (_parent, { id }, { services }) => {
			const layerTemplate = await services.layerTemplate.findById(id)
			if (!layerTemplate) {
				throw new NotFoundError(`LayerInstance option with ${id} not found`)
			}
			return layerTemplate
		},
	}),
	layerTemplates: t.field({
		type: ["LayerTemplate"],
		resolve: async (_parent, _args, { services }) => {
			return services.layerTemplate.findAll()
		},
	}),
}))
