import { isUniqueViolation } from "../../db/utils"
import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError, ValidationError } from "../error"
import { SimulationRepository } from "../simulation/simulation.repository"
import { SimulationStateService } from "../simulation-state/simulation-state.service"
import type { Scenario } from "./scenario.model"
import { ScenarioRepository } from "./scenario.repository"

export class ScenarioService {
	private readonly repo: ScenarioRepository
	private readonly simulationRepo: SimulationRepository

	constructor(client: DbClient) {
		this.repo = new ScenarioRepository(client)
		this.simulationRepo = new SimulationRepository(client)
	}

	async createScenario(input: {
		simulationId: string
		userId: string
	}): Promise<Scenario> {
		const { simulationId, userId } = input

		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation) {
			throw new NotFoundError("Simulation not found")
		}
		if (simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}

		return await this.repo.client.transaction(async (tx) => {
			const simulationStateService = new SimulationStateService(tx)
			const repo = new ScenarioRepository(tx)
			const scenarios = await repo.findManyBySimulationId(simulationId)

			const usedNumbers = scenarios
				.map((s) => {
					const match = s.name.match(/^Scenario (\d+)$/)
					return match ? parseInt(match[1], 10) : null
				})
				.filter((n): n is number => n !== null)
				.sort((a, b) => a - b)

			// Find the lowest missing number starting at 1
			let newNumber = 1
			for (let i = 0; i < usedNumbers.length; i++) {
				if (usedNumbers[i] !== i + 1) {
					newNumber = i + 1
					break
				}
				newNumber = usedNumbers.length + 1
			}

			let scenario: Scenario | null = null
			let attempts = 0

			while (true) {
				attempts++
				try {
					scenario = await repo.create({
						simulationId,
						name: `Scenario ${newNumber}`,
					})
					break
				} catch (err) {
					if (isUniqueViolation(err) && attempts < 5) {
						newNumber++
						continue
					}
					throw new ValidationError([
						{ field: "name", message: "Scenario name must be unique" },
					])
				}
			}

			// Update nextScenarioNumber to max + 1
			const maxNumber = Math.max(newNumber, ...usedNumbers, 0)
			await this.simulationRepo.update(simulationId, {
				nextScenarioNumber: maxNumber + 1,
			})
			await simulationStateService.createState(userId, {
				simulationId,
				scenarioId: scenario.id,
			})
			return scenario
		})
	}

	async deleteScenario(input: { userId: string; id: string }): Promise<void> {
		const { userId, id } = input
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

	async getScenario(input: { userId: string; id: string }): Promise<Scenario> {
		const { userId, id } = input
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

	async getScenariosBySimulationId(input: {
		userId: string
		simulationId: string
	}): Promise<Scenario[]> {
		const { userId, simulationId } = input
		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}
		return this.repo.findManyBySimulationId(simulationId)
	}

	async renameScenario(input: {
		id: string
		name: string
		userId: string
	}): Promise<Scenario> {
		const { id, name, userId } = input
		const trimmedName = name.trim()
		if (!trimmedName) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}

		const scenario = await this.repo.findById(id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const simulation = await this.simulationRepo.findById(scenario.simulationId)
		if (!simulation || simulation.userId !== userId) {
			throw new ForbiddenError("You do not own this simulation")
		}

		return this.repo.rename({ id, name: trimmedName })
	}
}
