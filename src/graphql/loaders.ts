import { canvasLoaders } from "../modules/canvas/canvas.loader"
import { CanvasRepository } from "../modules/canvas/canvas.repository"
import { createUserLoader } from "../modules/user/user.loader"
import { UserRepository } from "../modules/user/user.repository"
import type { DbClient } from "../types/db"

export function createLoaders(db: DbClient) {
	const userRepo = new UserRepository(db)
	const canvasRepo = new CanvasRepository(db)

	return {
		user: createUserLoader(userRepo),
		canvas: canvasLoaders(canvasRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
