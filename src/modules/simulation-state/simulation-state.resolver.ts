import { builder } from "../../graphql/builder"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"

builder.mutationFields((t) => ({
	updateLastViewedSimulation: t.fieldWithInput({
		type: "Boolean",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
			directResult: false,
		},
		input: {
			simulationId: t.input.id({ required: true }),
			scenarioId: t.input.id({ required: true }),
		},
		resolve: async (_p, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to update the last viewed simulation.",
				)
			}
			await services.simulationState.viewNewScenario(user.id, input)
			return true
		},
	}),
}))
