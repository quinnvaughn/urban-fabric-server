/**
 * Strips null and undefined values from an object, returning only the keys
 * with actual values. Useful for building partial update payloads from
 * optional GraphQL inputs without accidentally overwriting existing data.
 */
export function omitNullish<T extends Record<string, unknown>>(
	obj: T,
): Partial<{ [K in keyof T]: NonNullable<T[K]> }> {
	return Object.fromEntries(
		Object.entries(obj).filter(([, v]) => v != null),
	) as Partial<{ [K in keyof T]: NonNullable<T[K]> }>
}
