import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error/error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import { SimulationRepository } from "../simulation/simulation.repository"
import type { LayerInstance, LayerInstanceInsert } from "./layer-instance.model"
import { LayerInstanceRepository } from "./layer-instance.repository"

export class LayerInstanceService {
	private readonly repo: LayerInstanceRepository
	private readonly scenarioRepo: ScenarioRepository
	private readonly simulationRepo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new LayerInstanceRepository(client)
		this.scenarioRepo = new ScenarioRepository(client)
		this.simulationRepo = new SimulationRepository(client)
	}

	async create(
		userId: string,
		input: LayerInstanceInsert,
	): Promise<LayerInstance> {
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

	async findById(id: string): Promise<LayerInstance | null> {
		const layerInstance = await this.repo.findById(id)
		if (!layerInstance) {
			throw new NotFoundError("LayerInstance not found")
		}
		return layerInstance
	}

	async upsert(
		userId: string,
		input: LayerInstanceInsert,
	): Promise<LayerInstance> {
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
				throw new ForbiddenError("You cannot update this layerInstance")
			}
		}

		return this.repo.upsert(input)
	}
}
