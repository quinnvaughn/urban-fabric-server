import { builder } from "../../graphql/builder"
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../error"

builder.mutationFields((t) => ({
	createSimulation: t.fieldWithInput({
		type: "Simulation",
		errors: {
			types: [UnauthorizedError],
		},
		input: {
			name: t.input.string({ required: true }),
			description: t.input.string({ required: false }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to create a simulation.",
				)
			}
			const newSimulation = await services.simulation.createSimulation(
				user.id,
				{
					name: input.name.trim(),
					description: input.description?.trim() || undefined,
				},
			)

			return { ...newSimulation, __typename: "Simulation" }
		},
	}),
	deleteSimulation: t.fieldWithInput({
		type: "Boolean",
		errors: {
			directResult: false,
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
		},
		input: {
			id: t.input.id({ required: true }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to delete a simulation.",
				)
			}
			await services.simulation.deleteSimulation(input.id, user.id)
			return true
		},
	}),
	updateSimulation: t.fieldWithInput({
		type: "Simulation",
		errors: {
			types: [
				UnauthorizedError,
				NotFoundError,
				ForbiddenError,
				ValidationError,
			],
		},
		input: {
			id: t.input.id({ required: true }),
			name: t.input.string({ required: false }),
			description: t.input.string({ required: false }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to update a simulation.",
				)
			}
			await services.simulation.updateSimulation(input.id, user.id, {
				name: input.name?.trim(),
				description: input.description?.trim(),
			})
			return await services.simulation.getSimulation(input.id, user.id)
		},
	}),
}))

builder.queryFields((t) => ({
	simulation: t.field({
		type: "Simulation",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
		},
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (_parent, { id }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError(
					"You must be logged in to view a simulation.",
				)
			}
			return await services.simulation.getSimulation(id, user.id)
		},
	}),
}))
