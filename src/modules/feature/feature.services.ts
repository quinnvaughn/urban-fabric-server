import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error/error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import { SimulationRepository } from "../simulation/simulation.repository"
import type { Feature, FeatureInsert } from "./feature.model"
import { FeatureRepository } from "./feature.repository"

export class FeatureService {
	private readonly repo: FeatureRepository
	private readonly scenarioRepo: ScenarioRepository
	private readonly simulationRepo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new FeatureRepository(client)
		this.scenarioRepo = new ScenarioRepository(client)
		this.simulationRepo = new SimulationRepository(client)
	}

	async create(userId: string, input: FeatureInsert): Promise<Feature> {
		const scenario = await this.scenarioRepo.findById(input.scenarioId)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}

		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
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

	async upsert(userId: string, input: FeatureInsert): Promise<Feature> {
		const scenario = await this.scenarioRepo.findById(input.scenarioId)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}

		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
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
