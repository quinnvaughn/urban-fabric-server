import { builder } from "../../graphql/builder"
import { NotFoundError } from "../error"

builder.queryFields((t) => ({
	featureOption: t.field({
		type: "FeatureOption",
		errors: {
			types: [NotFoundError],
		},
		args: {
			id: t.arg.id(),
		},
		resolve: async (_parent, { id }, { services }) => {
			const featureOption = await services.featureOption.findById(id)
			if (!featureOption) {
				throw new NotFoundError(`Feature option with ${id} not found`)
			}
			return featureOption
		},
	}),
	featureOptions: t.field({
		type: ["FeatureOption"],
		resolve: async (_parent, _args, { services }) => {
			return services.featureOption.findAll()
		},
	}),
}))
