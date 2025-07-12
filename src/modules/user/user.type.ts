import { builder } from "../../graphql/builder"
import { ValidationError } from "../error"

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

export const RegisterResponse = builder.unionType("RegisterResponse", {
	types: ["User", ValidationError],
	resolveType: (value) => {
		if ("id" in value) {
			return "User"
		}
		return "ValidationError"
	},
})
