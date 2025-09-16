import bcrypt from "bcrypt"
import type { DbClient } from "../../types/db"
import { NotFoundError, UnauthorizedError, ValidationError } from "../error"
import { WhitelistRepository } from "../whitelist/whitelist.repository"
import type { UserInsert } from "./user.model"
import { UserRepository } from "./user.repository"

export class UserService {
	private repo: UserRepository

	constructor(dbClient: DbClient) {
		this.repo = new UserRepository(dbClient)
	}

	async registerUser(
		input: Omit<UserInsert, "hashedPassword"> & { password: string },
	) {
		return this.repo.client.transaction(async (tx) => {
			const repoTx = new UserRepository(tx)
			const whitelistRepo = new WhitelistRepository(tx)
			const existing = await repoTx.findUserByEmail(input.email)
			if (existing) {
				throw new ValidationError([
					{ field: "email", message: "Email is already in use" },
				])
			}

			const normalizedEmail = input.email.toLowerCase().trim()

			// check if email is on whitelist
			const isValidEmail =
				await whitelistRepo.isEmailWhitelisted(normalizedEmail)

			if (!isValidEmail) {
				throw new ValidationError([
					{ field: "email", message: "Email is not on the whitelist" },
				])
			}

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
