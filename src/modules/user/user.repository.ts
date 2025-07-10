import type { DbClient } from "../../types/db"
import { users } from "./user.model"

export async function findUserByEmail(client: DbClient, email: string) {
	return client.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	})
}

export async function findUserById(client: DbClient, id: string) {
	return client.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
	})
}

export async function createUser(
	client: DbClient,
	input: {
		email: string
		name: string
		hashedPassword: string
		role?: string
	},
) {
	return client
		.insert(users)
		.values({
			email: input.email,
			hashed_password: input.hashedPassword,
			name: input.name,
			role: input.role || "user",
		})
		.returning()
		.then(([user]) => user)
}
