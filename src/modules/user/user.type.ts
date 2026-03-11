import { getEnvVars } from "../../config"
import { builder } from "../../graphql/builder"
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../error"

builder.objectType("User", {
	fields: (t) => ({
		id: t.exposeID("id"),
		email: t.exposeString("email"),
		name: t.exposeString("name"),
		role: t.exposeString("role"),
	}),
})

builder.queryFields((t) => ({
	user: t.field({
		type: "User",
		errors: { types: [NotFoundError] },
		args: { id: t.arg.id({ required: true }) },
		resolve: (_parent, args, { services }) =>
			services.user.getUserById(args.id),
	}),
	me: t.field({
		type: "User",
		nullable: true,
		resolve: (_parent, _args, { user }) => user,
	}),
}))

builder.mutationFields((t) => ({
	register: t.fieldWithInput({
		type: "User",
		errors: { types: [ConflictError, ValidationError] },
		input: {
			email: t.input.string({ required: true }),
			password: t.input.string({ required: true }),
			name: t.input.string({ required: true }),
		},
		resolve: async (_parent, { input }, { user, services, req }) => {
			if (user) throw new ConflictError("You are already registered.")
			const newUser = await services.user.registerUser({
				...input,
				role: "user",
			})
			req.session.userId = newUser.id
			return { ...newUser, __typename: "User" }
		},
	}),
	login: t.fieldWithInput({
		type: "User",
		errors: { types: [ConflictError, UnauthorizedError] },
		input: {
			email: t.input.string({ required: true }),
			password: t.input.string({ required: true }),
		},
		resolve: async (_parent, { input }, { services, user, req }) => {
			if (user) throw new ConflictError("You are already logged in.")
			const found = await services.user.loginUser(input)
			req.session.userId = found.id
			return { ...found, __typename: "User" }
		},
	}),
	logout: t.field({
		type: "Boolean",
		resolve: async (_parent, _args, { req, res }) => {
			const envVars = getEnvVars()
			if (!req.session || !req.session.userId) return true
			return new Promise<boolean>((resolve) => {
				req.session.destroy((err) => {
					if (err) return resolve(false)
					res.clearCookie("connect.sid", {
						httpOnly: true,
						secure: envVars.NODE_ENV === "production",
						sameSite: "lax",
					})
					resolve(true)
				})
			})
		},
	}),
}))
