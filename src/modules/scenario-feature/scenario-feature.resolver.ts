import { builder } from "../../graphql/builder"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"

builder.mutationFields((t) => ({
	createScenarioFeature: t.fieldWithInput({
		type: "ScenarioFeature",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
			directResult: false,
		},
		input: {
			scenarioId: t.input.id({ required: true }),
			type: t.input.string({ required: true }),
			geometry: t.input.field({ type: "GeoJSON", required: true }),
			properties: t.input.field({ type: "JSON", required: true }),
		},
		resolve: async (_root, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to create a scenario feature",
				)
			}
			return await services.scenarioFeature.create(user.id, input)
		},
	}),
}))
