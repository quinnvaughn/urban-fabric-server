import type { Geometry } from "geojson"
import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error/error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import { CanvasRepository } from "../simulation/simulation.repository"
import type { Feature } from "./feature.model"
import { FeatureRepository } from "./feature.repository"

export class FeatureService {
	private readonly repo: FeatureRepository
	private readonly scenarioRepo: ScenarioRepository
	private readonly canvasRepo: CanvasRepository

	constructor(client: DbClient) {
		this.repo = new FeatureRepository(client)
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
	): Promise<Feature> {
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

	async findById(id: string): Promise<Feature | null> {
		const feature = await this.repo.findById(id)
		if (!feature) {
			throw new NotFoundError("Feature not found")
		}
		return feature
	}

	async upsert(
		userId: string,
		input: {
			id?: string
			scenarioId: string
			optionId: string
			geometry: Geometry
			properties: Record<string, unknown>
		},
	): Promise<Feature> {
		const scenario = await this.scenarioRepo.findById(input.scenarioId)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}

		const canvas = await this.canvasRepo.findById(scenario.canvasId)
		if (!canvas || canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this scenario")
		}

		if (input.id) {
			const existing = await this.repo.findById(input.id)
			if (!existing || existing.scenarioId !== input.scenarioId) {
				throw new ForbiddenError("You cannot update this feature")
			}
		}

		return this.repo.upsert(input)
	}
}
