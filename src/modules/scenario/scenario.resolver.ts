import { builder } from "../../graphql/builder"
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../error"

builder.mutationFields((t) => ({
	createScenario: t.fieldWithInput({
		type: "Scenario",
		errors: {
			types: [
				UnauthorizedError,
				NotFoundError,
				ForbiddenError,
				ValidationError,
			],
		},
		input: {
			simulationId: t.input.id({ required: true }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to create a scenario.",
				)
			}
			return await services.scenario.createScenario({
				userId: user.id,
				...input,
			})
		},
	}),
	renameScenario: t.fieldWithInput({
		type: "Scenario",
		errors: {
			types: [
				UnauthorizedError,
				ValidationError,
				NotFoundError,
				ForbiddenError,
			],
		},
		input: {
			id: t.input.id({ required: true }),
			name: t.input.string({ required: true }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to rename a scenario.",
				)
			}
			return await services.scenario.renameScenario({
				userId: user.id,
				...input,
			})
		},
	}),
}))
