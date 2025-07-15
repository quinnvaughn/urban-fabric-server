import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError, ValidationError } from "../error"
import { SimulationRepository } from "../simulation/simulation.repository"
import type { Scenario } from "./scenario.model"
import { ScenarioRepository } from "./scenario.repository"

export class ScenarioService {
	private readonly repo: ScenarioRepository
	private readonly simulationRepo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new ScenarioRepository(client)
		this.simulationRepo = new SimulationRepository(client)
	}

	async createScenario(
		userId: string,
		input: { name: string; simulationId: string },
	): Promise<Scenario> {
		if (!input.name.trim()) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}

		const simulation = await this.simulationRepo.findById(input.simulationId)
		if (!simulation) {
			throw new NotFoundError("Canvas not found")
		}
		if (simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}

		return await this.repo.create({
			simulationId: input.simulationId,
			name: input.name.trim(),
		})
	}

	async deleteScenario(userId: string, id: string): Promise<void> {
		const scenario = await this.repo.findById(id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}
		await this.repo.delete(id)
	}

	async getScenario(userId: string, id: string): Promise<Scenario> {
		const scenario = await this.repo.findById(id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}
		return scenario
	}

	async getScenariosBySimulationId(
		userId: string,
		simulationId: string,
	): Promise<Scenario[]> {
		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}
		return this.repo.findManyByCanvasId(simulationId)
	}

	async renameScenario(
		userId: string,
		input: { id: string; name: string },
	): Promise<Scenario> {
		const trimmedName = input.name.trim()
		if (!trimmedName) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}

		const scenario = await this.repo.findById(input.id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}

		return this.repo.rename(input.id, trimmedName)
	}
}
