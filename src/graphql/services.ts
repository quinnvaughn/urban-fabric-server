import { CanvasService } from "../modules/canvas/canvas.service"
import { CategoryService } from "../modules/category/category.service"
import { FeatureService } from "../modules/feature/feature.services"
import { FeatureOptionService } from "../modules/feature-option/feature-option.service"
import { ScenarioService } from "../modules/scenario/scenario.service"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		user: new UserService(db),
		canvas: new CanvasService(db),
		scenario: new ScenarioService(db),
		feature: new FeatureService(db),
		featureOption: new FeatureOptionService(db),
		category: new CategoryService(db),
	}
}

export type Services = ReturnType<typeof createServices>
