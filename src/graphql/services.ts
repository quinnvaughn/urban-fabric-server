import { CanvasService } from "../modules/canvas/canvas.service"
import { FeatureService } from "../modules/feature/feature.services"
import { ScenarioService } from "../modules/scenario/scenario.service"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		user: new UserService(db),
		canvas: new CanvasService(db),
		scenario: new ScenarioService(db),
		feature: new FeatureService(db),
	}
}

export type Services = ReturnType<typeof createServices>
