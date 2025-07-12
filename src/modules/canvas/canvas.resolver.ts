import { builder } from "../../graphql/builder"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"

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
			const newCanvas = await services.canvas.createCanvas(user.id, {
				name: input.name.trim(),
				description: input.description?.trim() || undefined,
			})

			return { ...newCanvas, __typename: "Canvas" }
		},
	}),
}))

builder.queryFields((t) => ({
	canvas: t.field({
		type: "Canvas",
		errors: {
			types: [UnauthorizedError, NotFoundError, ForbiddenError],
		},
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (_parent, { id }, { services, user }) => {
			if (!user) {
				throw new UnauthorizedError("You must be logged in to view a canvas.")
			}
			return await services.canvas.getCanvas(id, user.id)
		},
	}),
}))
