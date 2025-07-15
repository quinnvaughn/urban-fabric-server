import { featureLoaders } from "../modules/feature/feature.loader"
import { FeatureRepository } from "../modules/feature/feature.repository"
import { featureOptionLoaders } from "../modules/feature-option/feature-option.loader"
import { FeatureOptionRepository } from "../modules/feature-option/feature-option.repository"
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
	const featureRepo = new FeatureRepository(db)
	const featureOptionRepo = new FeatureOptionRepository(db)

	return {
		user: createUserLoader(userRepo),
		simulation: simulationLoaders(simulationRepo),
		scenario: scenarioLoaders(scenarioRepo),
		feature: featureLoaders(featureRepo),
		featureOption: featureOptionLoaders(featureOptionRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
