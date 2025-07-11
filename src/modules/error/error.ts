export abstract class ApplicationError extends Error {
	public readonly name: string
	public readonly statusCode: string

	constructor(message: string, code: string) {
		super(message)
		this.name = this.constructor.name
		this.statusCode = code
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends ApplicationError {
	constructor(message = "Resource not found") {
		super(message, "NOT_FOUND")
	}
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends ApplicationError {
	constructor(message = "Forbidden") {
		super(message, "FORBIDDEN")
	}
}

export class FieldError {
	constructor(
		public field: string,
		public message: string,
	) {}
}

/**
 * 400 Bad Request Error
 */
export class ValidationError extends ApplicationError {
	public readonly errors?: FieldError[]
	constructor(message = "Validation failed", errors?: FieldError[]) {
		super(message, "VALIDATION_ERROR")
		this.errors = errors
	}
}
