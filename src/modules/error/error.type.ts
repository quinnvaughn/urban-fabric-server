import { builder } from "../../graphql/builder"
import {
	FieldError,
	ForbiddenError,
	NotFoundError,
	ValidationError,
} from "./error"

builder.objectType(FieldError, {
	name: "FieldError",
	fields: (t) => ({
		field: t.exposeString("field"),
		message: t.exposeString("message"),
	}),
})

builder.objectType(NotFoundError, {
	name: "NotFoundError",
	fields: (t) => ({
		message: t.exposeString("message"),
		statusCode: t.exposeString("statusCode"),
	}),
})

builder.objectType(ForbiddenError, {
	name: "ForbiddenError",
	fields: (t) => ({
		message: t.exposeString("message"),
		statusCode: t.exposeString("statusCode"),
	}),
})

builder.objectType(ValidationError, {
	name: "ValidationError",
	fields: (t) => ({
		message: t.exposeString("message"),
		statusCode: t.exposeString("statusCode"),
		errors: t.field({
			type: [FieldError],
			nullable: true,
			resolve: (error) => error.errors || [],
		}),
	}),
})
