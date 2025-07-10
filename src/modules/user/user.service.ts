import bcrypt from "bcrypt"
import { db } from "../../db"
import * as repo from "./user.repository"

export class UserError extends Error {}

export async function registerUser(input: {
	email: string
	name: string
	password: string
	role?: string
}) {
	return db.transaction(async (tx) => {
		const existing = await repo.findUserByEmail(tx, input.email)
		if (existing) throw new UserError("Email is already in use")

		const hashed = await bcrypt.hash(input.password, 12)
		const user = await repo.createUser(tx, {
			email: input.email,
			name: input.name,
			hashedPassword: hashed,
			role: input.role,
		})
		return user
	})
}

export async function loginUser(input: { email: string; password: string }) {
	const user = await repo.findUserByEmail(db, input.email)
	if (!user) throw new UserError("Invalid email or password")

	const isPasswordValid = await bcrypt.compare(
		input.password,
		user.hashed_password,
	)
	if (!isPasswordValid) throw new UserError("Invalid email or password")

	return user
}

export async function getUserById(id: string) {
	const user = await repo.findUserById(db, id)
	if (!user) throw new UserError("User not found")
	return user
}
