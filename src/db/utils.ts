export function isUniqueViolation(error: any): boolean {
	return (
		error &&
		(error.code === "23505" || // Postgres unique violation
			error.message?.includes("duplicate key value"))
	)
}
