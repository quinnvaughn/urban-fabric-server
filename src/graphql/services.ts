import { CategoryService } from "../modules/category/category.service"
import { LayerInstanceService } from "../modules/layer-instance/layer-instance.services"
import { LayerTemplateService } from "../modules/layer-template/layer-template.service"
import { ScenarioService } from "../modules/scenario/scenario.service"
import { SimulationService } from "../modules/simulation/simulation.service"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		user: new UserService(db),
		simulation: new SimulationService(db),
		scenario: new ScenarioService(db),
		layerInstance: new LayerInstanceService(db),
		layerTemplate: new LayerTemplateService(db),
		category: new CategoryService(db),
	}
}

export type Services = ReturnType<typeof createServices>
