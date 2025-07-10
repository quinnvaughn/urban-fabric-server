import bcrypt from "bcrypt"
import type { DbClient } from "../../types/db"
import { UserRepository } from "./user.repository"

export class UserError extends Error {}

export class UserService {
	private repo: UserRepository

	constructor(dbClient: DbClient) {
		this.repo = new UserRepository(dbClient)
	}

	async registerUser(input: {
		email: string
		name: string
		password: string
		role?: string
	}) {
		return this.repo.client.transaction(async (tx) => {
			const repoTx = new UserRepository(tx)
			const existing = await repoTx.findUserByEmail(input.email)
			if (existing) {
				throw new UserError("Email is already in use")
			}

			const hashed = await bcrypt.hash(input.password, 12)
			const user = await repoTx.createUser({
				email: input.email,
				name: input.name,
				hashedPassword: hashed,
				role: input.role,
			})
			return user
		})
	}

	async loginUser(input: { email: string; password: string }) {
		const user = await this.repo.findUserByEmail(input.email)
		if (!user) throw new UserError("Invalid email or password")

		const isPasswordValid = await bcrypt.compare(
			input.password,
			user.hashed_password,
		)
		if (!isPasswordValid) throw new UserError("Invalid email or password")

		return user
	}

	async getUserById(id: string) {
		const user = await this.repo.findUserById(id)
		if (!user) throw new UserError("User not found")
		return user
	}
}
