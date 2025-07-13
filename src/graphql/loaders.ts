import { canvasLoaders } from "../modules/canvas/canvas.loader"
import { CanvasRepository } from "../modules/canvas/canvas.repository"
import { featureLoaders } from "../modules/feature/feature.loader"
import { FeatureRepository } from "../modules/feature/feature.repository"
import { scenarioLoaders } from "../modules/scenario/scenario.loader"
import { ScenarioRepository } from "../modules/scenario/scenario.repository"
import { createUserLoader } from "../modules/user/user.loader"
import { UserRepository } from "../modules/user/user.repository"
import type { DbClient } from "../types/db"

export function createLoaders(db: DbClient) {
	const userRepo = new UserRepository(db)
	const canvasRepo = new CanvasRepository(db)
	const scenarioRepo = new ScenarioRepository(db)
	const featureRepo = new FeatureRepository(db)

	return {
		user: createUserLoader(userRepo),
		canvas: canvasLoaders(canvasRepo),
		scenario: scenarioLoaders(scenarioRepo),
		feature: featureLoaders(featureRepo),
	}
}

export type Loaders = ReturnType<typeof createLoaders>
