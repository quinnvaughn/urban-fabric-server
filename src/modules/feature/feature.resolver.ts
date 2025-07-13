import { builder } from "../../graphql/builder"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"

builder.mutationFields((t) => ({
	upsertFeature: t.fieldWithInput({
		type: "Feature",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
			directResult: false,
		},
		input: {
			scenarioId: t.input.id({ required: true }),
			optionId: t.input.id({ required: true }),
			geometry: t.input.field({ type: "GeoJSON", required: true }),
			properties: t.input.field({ type: "JSON", required: true }),
		},
		resolve: async (_root, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to create a scenario feature",
				)
			}
			return await services.feature.upsert(user.id, input)
		},
	}),
}))
