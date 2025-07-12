import type { Geometry } from "geojson"
import type { DbClient } from "../../types/db"
import { CanvasRepository } from "../canvas/canvas.repository"
import { ForbiddenError, NotFoundError } from "../error/error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import type { ScenarioFeature } from "./scenario-feature.model"
import { ScenarioFeatureRepository } from "./scenario-feature.repository"

export class ScenarioFeatureService {
	private readonly repo: ScenarioFeatureRepository
	private readonly scenarioRepo: ScenarioRepository
	private readonly canvasRepo: CanvasRepository

	constructor(client: DbClient) {
		this.repo = new ScenarioFeatureRepository(client)
		this.scenarioRepo = new ScenarioRepository(client)
		this.canvasRepo = new CanvasRepository(client)
	}

	async create(
		userId: string,
		input: {
			scenarioId: string
			type: string
			geometry: Geometry
			properties: Record<string, unknown>
		},
	): Promise<ScenarioFeature> {
		const scenario = await this.scenarioRepo.findById(input.scenarioId)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}

		const canvas = await this.canvasRepo.findById(scenario.canvasId)
		if (!canvas || canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this scenario")
		}

		return this.repo.create(input)
	}
}
