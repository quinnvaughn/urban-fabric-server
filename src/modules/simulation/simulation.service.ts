import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError, ValidationError } from "../error"
import { ScenarioService } from "../scenario/scenario.service"
import type { Simulation, SimulationInsert } from "./simulation.model"
import { SimulationRepository } from "./simulation.repository"

export class SimulationService {
	private repo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new SimulationRepository(client)
	}

	async createSimulation(input: {
		name: string
		userId: string
	}): Promise<Simulation> {
		return this.repo.client.transaction(async (tx) => {
			const simulationRepo = new SimulationRepository(tx)
			const scenarioService = new ScenarioService(tx)

			const simulation = await simulationRepo.create({ ...input })
			// add default scenario
			await scenarioService.createScenario({
				userId: input.userId,
				simulationId: simulation.id,
				name: "Scenario 1",
			})
			return simulation
		})
	}

	async getSimulation(input: {
		id: string
		userId: string
	}): Promise<Simulation> {
		const { id, userId } = input
		const simulation = await this.repo.findById(id)
		if (!simulation) {
			throw new NotFoundError(`Simulation with id ${id} not found`)
		}
		if (simulation.userId !== userId) {
			throw new ForbiddenError(
				`You do not have permission to access this simulation`,
			)
		}
		return simulation
	}

	async updateSimulation(
		id: string,
		userId: string,
		updates: Partial<SimulationInsert>,
	) {
		await this.getSimulation({ id, userId }) // Ensure simulation exists and belongs to user
		if (updates.name !== undefined && !updates.name.trim()) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}
		await this.repo.update(id, updates)
	}

	async deleteSimulation(input: { id: string; userId: string }): Promise<void> {
		await this.getSimulation(input) // Ensure simulation exists and belongs to user
		await this.repo.delete(input.id)
	}
}
