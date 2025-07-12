import { CanvasService } from "../modules/canvas/canvas.service"
import { ScenarioService } from "../modules/scenario/scenario.service"
import { ScenarioFeatureService } from "../modules/scenario-feature/scenario-feature.services"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		user: new UserService(db),
		canvas: new CanvasService(db),
		scenario: new ScenarioService(db),
		scenarioFeature: new ScenarioFeatureService(db),
	}
}

export type Services = ReturnType<typeof createServices>
