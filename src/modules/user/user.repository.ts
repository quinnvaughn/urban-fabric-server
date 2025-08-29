import { eq } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type UserInsert, users } from "./user.model"

export class UserRepository {
	constructor(readonly client: DbClient) {}

	async findUserByEmail(email: string) {
		return this.client.query.users.findFirst({
			where: {
				email,
			},
		})
	}

	async findManyUsersByIds(ids: string[]) {
		return this.client.query.users.findMany({
			where: {
				id: {
					in: ids,
				},
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

	async createUser(input: UserInsert) {
		return this.client
			.insert(users)
			.values({
				...input,
			})
			.returning()
			.then(([user]) => user)
	}

	async setDefaultLatLng(input: { userId: string; lat: number; lng: number }) {
		return this.client
			.update(users)
			.set({
				defaultLat: input.lat,
				defaultLng: input.lng,
			})
			.where(eq(users.id, input.userId))
			.returning()
			.then(([user]) => user)
	}
}
