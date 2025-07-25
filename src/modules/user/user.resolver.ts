import { getEnvVars } from "../../config"
import { builder } from "../../graphql/builder"
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../error"

builder.mutationFields((t) => ({
	register: t.fieldWithInput({
		type: "User",
		errors: {
			types: [ForbiddenError, ValidationError],
		},
		input: {
			email: t.input.string({ required: true }),
			password: t.input.string({ required: true }),
			role: t.input.string({ required: false }),
		},
		resolve: async (_parent, { input }, { user, services, req }) => {
			// check if user is already registered
			if (user) {
				throw new ForbiddenError("You are already registered.")
			}
			const newUser = await services.user.registerUser({
				...input,
				role: input.role || "user",
			})
			req.session.userId = newUser.id
			return { ...newUser, __typename: "User" }
		},
	}),
	login: t.fieldWithInput({
		type: "User",
		errors: {
			types: [ForbiddenError, UnauthorizedError],
		},
		input: {
			email: t.input.string({ required: true }),
			password: t.input.string({ required: true }),
		},
		resolve: async (_parent, { input }, { services, user, req }) => {
			// check if user is already logged in
			if (user) {
				throw new ForbiddenError("You are already logged in.")
			}
			const found = await services.user.loginUser(input)
			// return user data
			req.session.userId = found.id
			return { ...found, __typename: "User" }
		},
	}),
	logout: t.field({
		type: "Boolean",
		resolve: async (_parent, _args, { req, res }) => {
			const envVars = getEnvVars()
			// If no session exists, return false
			if (!req.session || !req.session.userId) {
				return false
			}
			// Clear the session to log out the user
			return new Promise<boolean>((resolve) => {
				req.session.destroy((err) => {
					if (err) {
						return resolve(false)
					}
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

builder.queryFields((t) => ({
	user: t.field({
		type: "User",
		errors: {
			types: [NotFoundError],
		},
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (_parent, args, { services }) => {
			return services.user.getUserById(args.id)
		},
	}),
	currentUser: t.field({
		type: "User",
		nullable: true,
		resolve: async (_parent, _args, { user }) => {
			return user
		},
	}),
}))
