import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError, ValidationError } from "../error"
import { ScenarioService } from "../scenario/scenario.service"
import { SimulationStateService } from "../simulation-state/simulation-state.service"
import type { Simulation } from "./simulation.model"
import { SimulationRepository } from "./simulation.repository"

export class SimulationService {
	private repo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new SimulationRepository(client)
	}

	async createSimulation(userId: string, input: { name: string }) {
		return this.repo.client.transaction(async (tx) => {
			const simulationRepo = new SimulationRepository(tx)
			const scenarioService = new ScenarioService(tx)
			const simulationStateService = new SimulationStateService(tx)

			const simulation = await simulationRepo.create(input, userId)
			// add default scenario
			const scenario = await scenarioService.createScenario(userId, {
				simulationId: simulation.id,
				name: "Untitled Scenario",
			})
			// create initial state
			await simulationStateService.createState(userId, {
				simulationId: simulation.id,
				scenarioId: scenario.id,
			})
			return simulation
		})
	}

	async getSimulation(id: string, userId: string): Promise<Simulation> {
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
		updates: Partial<Omit<Simulation, "id" | "userId" | "createdAt">>,
	) {
		await this.getSimulation(id, userId) // Ensure simulation exists and belongs to user
		if (updates.name !== undefined && !updates.name.trim()) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}
		await this.repo.update(id, updates)
	}

	async deleteSimulation(id: string, userId: string): Promise<void> {
		await this.getSimulation(id, userId)
		await this.repo.delete(id)
	}
}
