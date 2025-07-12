import { canvasLoaders } from "../modules/canvas/canvas.loader"
import { CanvasRepository } from "../modules/canvas/canvas.repository"
import { scenarioLoaders } from "../modules/scenario/scenario.loader"
import { ScenarioRepository } from "../modules/scenario/scenario.repository"
import { scenarioFeatureLoaders } from "../modules/scenario-feature/scenario-feature.loader"
import { ScenarioFeatureRepository } from "../modules/scenario-feature/scenario-feature.repository"
import { createUserLoader } from "../modules/user/user.loader"
import { UserRepository } from "../modules/user/user.repository"
import type { DbClient } from "../types/db"

export function createLoaders(db: DbClient) {
	const userRepo = new UserRepository(db)
	const canvasRepo = new CanvasRepository(db)
	const scenarioRepo = new ScenarioRepository(db)
	const scenarioFeatureRepo = new ScenarioFeatureRepository(db)

	return {
		user: createUserLoader(userRepo),
		canvas: canvasLoaders(canvasRepo),
		scenario: scenarioLoaders(scenarioRepo),
		scenarioFeature: scenarioFeatureLoaders(scenarioFeatureRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
