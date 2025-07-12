import bcrypt from "bcrypt"
import type { DbClient } from "../../types/db"
import { NotFoundError, UnauthorizedError, ValidationError } from "../error"
import { UserRepository } from "./user.repository"

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
				throw new ValidationError([
					{ field: "email", message: "Email is already in use" },
				])
			}

			const normalizedEmail = input.email.toLowerCase().trim()

			const hashed = await bcrypt.hash(input.password, 12)
			const user = await repoTx.createUser({
				email: normalizedEmail,
				name: input.name,
				hashedPassword: hashed,
				role: input.role || "user",
			})
			return user
		})
	}

	async loginUser(input: { email: string; password: string }) {
		const user = await this.repo.findUserByEmail(input.email)
		if (!user || !(await bcrypt.compare(input.password, user.hashedPassword))) {
			throw new UnauthorizedError("Invalid email or password")
		}

		return user
	}

	async getUserById(id: string) {
		const user = await this.repo.findUserById(id)
		if (!user) throw new NotFoundError("User not found")
		return user
	}
}
