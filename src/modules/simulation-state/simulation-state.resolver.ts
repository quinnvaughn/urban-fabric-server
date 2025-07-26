import { builder } from "../../graphql/builder"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"

builder.mutationFields((t) => ({
	updateLastViewedScenario: t.fieldWithInput({
		type: "SimulationState",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
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
			const state = await services.simulationState.getStateByUserAndSimulation({
				simulationId: input.simulationId,
				userId: user.id,
			})
			if (!state) {
				throw new NotFoundError(
					`Simulation state not found for user ${user.id} and simulation ${input.simulationId}`,
				)
			}
			return { ...state, __typename: "SimulationState" }
		},
	}),
}))
