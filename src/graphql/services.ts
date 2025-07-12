import { CanvasService } from "../modules/canvas/canvas.service"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		user: new UserService(db),
		canvas: new CanvasService(db),
	}
}

export type Services = ReturnType<typeof createServices>
