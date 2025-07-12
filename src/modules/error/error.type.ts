import { builder } from "../../graphql/builder"
import {
	type ApplicationError,
	ConflictError,
	FieldError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "./error"

const ErrorInterface = builder
	.interfaceRef<ApplicationError>("ApplicationError")
	.implement({
		fields: (t) => ({
			message: t.exposeString("message"),
		}),
	})

builder.objectType(FieldError, {
	name: "FieldError",
	fields: (t) => ({
		field: t.exposeString("field"),
		message: t.exposeString("message"),
	}),
})

builder.objectType(NotFoundError, {
	name: "NotFoundError",
	interfaces: [ErrorInterface],
})

builder.objectType(ForbiddenError, {
	name: "ForbiddenError",
	interfaces: [ErrorInterface],
})

builder.objectType(ValidationError, {
	name: "ValidationError",
	interfaces: [ErrorInterface],
	fields: (t) => ({
		errors: t.field({
			type: [FieldError],
			nullable: true,
			resolve: (error) => error.errors || [],
		}),
	}),
})

builder.objectType(UnauthorizedError, {
	name: "UnauthorizedError",
	interfaces: [ErrorInterface],
})

builder.objectType(ConflictError, {
	name: "ConflictError",
	interfaces: [ErrorInterface],
})
