import { createUserLoader } from "../modules/user/user.loader"
import { UserRepository } from "../modules/user/user.repository"
import type { DbClient } from "../types/db"

export function createLoaders(db: DbClient) {
	const userRepo = new UserRepository(db)

	return {
		user: createUserLoader(userRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
