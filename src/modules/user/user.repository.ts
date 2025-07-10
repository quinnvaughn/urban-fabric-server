import type { DbClient } from "../../types/db"
import { users } from "./user.model"

export class UserRepository {
	constructor(readonly client: DbClient) {}

	async findUserByEmail(email: string) {
		return this.client.query.users.findFirst({
			where: {
				email,
			},
		})
	}

	async findUserById(id: string) {
		return this.client.query.users.findFirst({
			where: {
				id,
			},
		})
	}

	async createUser(input: {
		email: string
		name: string
		hashedPassword: string
		role?: string
	}) {
		return this.client
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
}
