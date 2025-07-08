import { builder } from "../../graphql/builder"

builder.objectType("User", {
	fields: (t) => ({
		id: t.exposeID("id", { nullable: false }),
		email: t.exposeString("email", { nullable: false }),
		name: t.exposeString("name", { nullable: true }),
		role: t.exposeString("role", { nullable: false }),
	}),
})

export const RegisterInput = builder.inputType("RegisterInput", {
	fields: (t) => ({
		email: t.string({ required: true }),
		name: t.string({ required: true }),
		password: t.string({ required: true }),
		role: t.string({ required: false }),
	}),
})

export const LoginInput = builder.inputType("LoginInput", {
	fields: (t) => ({
		email: t.string({ required: true }),
		password: t.string({ required: true }),
	}),
})

export const AuthError = builder.simpleObject("AuthError", {
	fields: (t) => ({
		message: t.string({ nullable: true }),
	}),
})

export const AuthResponse = builder.unionType("AuthResponse", {
	types: ["User", AuthError],
	resolveType: (value) => {
		if ("id" in value) {
			return "User"
		}
		return "AuthError"
	},
})
