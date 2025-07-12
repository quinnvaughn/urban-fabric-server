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
