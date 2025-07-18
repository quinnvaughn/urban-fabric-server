import { layerInstanceLoaders } from "../modules/layer-instance/layer-instance.loader"
import { LayerInstanceRepository } from "../modules/layer-instance/layer-instance.repository"
import { layerTemplateLoaders } from "../modules/layer-template/layer-template.loader"
import { LayerTemplateRepository } from "../modules/layer-template/layer-template.repository"
import { scenarioLoaders } from "../modules/scenario/scenario.loader"
import { ScenarioRepository } from "../modules/scenario/scenario.repository"
import { simulationLoaders } from "../modules/simulation/simulation.loader"
import { SimulationRepository } from "../modules/simulation/simulation.repository"
import { createUserLoader } from "../modules/user/user.loader"
import { UserRepository } from "../modules/user/user.repository"
import type { DbClient } from "../types/db"

export function createLoaders(db: DbClient) {
	const userRepo = new UserRepository(db)
	const simulationRepo = new SimulationRepository(db)
	const scenarioRepo = new ScenarioRepository(db)
	const layerInstanceRepo = new LayerInstanceRepository(db)
	const layerTemplateRepo = new LayerTemplateRepository(db)

	return {
		user: createUserLoader(userRepo),
		simulation: simulationLoaders(simulationRepo),
		scenario: scenarioLoaders(scenarioRepo),
		layerInstance: layerInstanceLoaders(layerInstanceRepo),
		layerTemplate: layerTemplateLoaders(layerTemplateRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
