import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import { SimulationRepository } from "../simulation/simulation.repository"
import { UserRepository } from "../user/user.repository"
import type { SimulationState } from "./simulation-state.model"
import { SimulationStateRepository } from "./simulation-state.repository"

export class SimulationStateService {
	private repo: SimulationStateRepository
	private userRepo: UserRepository
	private simulationRepo: SimulationRepository
	private scenarioRepo: ScenarioRepository

	constructor(client: DbClient) {
		this.repo = new SimulationStateRepository(client)
		this.userRepo = new UserRepository(client)
		this.simulationRepo = new SimulationRepository(client)
		this.scenarioRepo = new ScenarioRepository(client)
	}

	async getStateByUserAndSimulation(input: {
		userId: string
		simulationId: string
	}): Promise<SimulationState | null> {
		const { userId, simulationId } = input
		// check if userId and simulationId are valid
		const user = await this.userRepo.findUserById(userId)
		if (!user) throw new NotFoundError(`User with id ${userId} not found`)

		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation)
			throw new NotFoundError(`Simulation with id ${simulationId} not found`)

		return this.repo.findByUserIdAndSimulationId(userId, simulationId)
	}

	async createState(
		userId: string,
		input: {
			simulationId: string
			scenarioId: string
		},
	): Promise<SimulationState> {
		// check if userId and simulationId are valid
		const { simulationId, scenarioId } = input
		const user = await this.userRepo.findUserById(userId)
		if (!user) throw new NotFoundError(`User with id ${userId} not found`)
		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation)
			throw new NotFoundError(`Simulation with id ${simulationId} not found`)

		// check if scenarioId is valid
		const scenario = await this.scenarioRepo.findById(scenarioId)
		if (!scenario)
			throw new NotFoundError(`Scenario with id ${scenarioId} not found`)
		// check if scenario belongs to simulation
		if (scenario.simulationId !== simulationId) {
			throw new ForbiddenError(
				`Scenario with id ${scenarioId} does not belong to simulation ${simulationId}`,
			)
		}
		// check if user has permission to create state for this simulation
		if (simulation.userId !== userId) {
			throw new ForbiddenError(
				`User ${userId} does not have permission to create state for simulation ${simulationId}`,
			)
		}
		return this.repo.create(userId, simulationId, scenarioId)
	}

	async viewNewScenario(
		userId: string,
		input: {
			simulationId: string
			scenarioId: string
		},
	): Promise<void> {
		const { simulationId, scenarioId } = input
		const user = await this.userRepo.findUserById(userId)
		if (!user) throw new NotFoundError(`User with id ${userId} not found`)

		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation)
			throw new NotFoundError(`Simulation with id ${simulationId} not found`)

		const scenario = await this.scenarioRepo.findById(scenarioId)
		if (!scenario)
			throw new NotFoundError(`Scenario with id ${scenarioId} not found`)

		if (scenario.simulationId !== simulationId) {
			throw new ForbiddenError(
				`Scenario with id ${scenarioId} does not belong to simulation ${simulationId}`,
			)
		}

		if (simulation.userId !== userId) {
			throw new ForbiddenError(
				`User ${userId} does not have permission to view state for simulation ${simulationId}`,
			)
		}

		await this.repo.viewNewScenario(user.id, simulation.id, scenario.id)
	}

	async updateLastOpenedAt(input: {
		userId: string
		simulationId: string
	}): Promise<void> {
		const { simulationId, userId } = input
		const user = await this.userRepo.findUserById(userId)
		if (!user) throw new NotFoundError(`User with id ${userId} not found`)

		const simulation = await this.simulationRepo.findById(simulationId)
		if (!simulation)
			throw new NotFoundError(`Simulation with id ${simulationId} not found`)

		if (simulation.userId !== userId) {
			throw new ForbiddenError(
				`User ${userId} does not have permission to view state for simulation ${simulationId}`,
			)
		}
		await this.repo.updateLastOpenedAt(userId, simulationId)
	}
}
