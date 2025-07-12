import { builder } from "../../graphql/builder"
import { UnauthorizedError } from "../error"

builder.mutationFields((t) => ({
	createCanvas: t.fieldWithInput({
		type: "Canvas",
		errors: {
			types: [UnauthorizedError],
		},
		input: {
			name: t.input.string({ required: true }),
			description: t.input.string({ required: false }),
		},
		resolve: async (_parent, { input }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError("You must be logged in to create a canvas.")
			}
			const newCanvas = await services.canvas.createCanvas(
				{
					name: input.name.trim(),
					description: input.description?.trim() || undefined,
				},
				user.id,
			)

			return { ...newCanvas, __typename: "Canvas" }
		},
	}),
}))

builder.queryFields((t) => ({
	canvas: t.field({
		type: "Canvas",
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (_parent, { id }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError("You must be logged in to view a canvas.")
			}
			const canvas = await services.canvas.getCanvas(id, user.id)
			if (!canvas) {
				throw new Error(`Canvas with id ${id} not found`)
			}
			return canvas
		},
	}),
}))
