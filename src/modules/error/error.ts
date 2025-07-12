export abstract class ApplicationError extends Error {
	public readonly name: string

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends ApplicationError {
	constructor(message = "Unauthorized") {
		super(message)
	}
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends ApplicationError {
	constructor(message = "Resource not found") {
		super(message)
	}
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends ApplicationError {
	constructor(message = "Forbidden") {
		super(message)
	}
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends ApplicationError {
	constructor(message = "Conflict") {
		super(message)
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
	public readonly errors: FieldError[]

	constructor(errors: FieldError[]) {
		super("Validation failed")
		this.errors = errors
	}
}

export class InternalError extends ApplicationError {
	constructor(message = "Internal server error") {
		super(message)
	}
}
