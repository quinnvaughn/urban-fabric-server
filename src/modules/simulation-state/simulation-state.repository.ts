import { and, eq } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type SimulationState, simulationState } from "./simulation-state.model"

export class SimulationStateRepository {
	constructor(readonly client: DbClient) {}

	async findByUserIdAndSimulationId(
		userId: string,
		simulationId: string,
	): Promise<SimulationState | null> {
		const state = await this.client.query.simulationState.findFirst({
			where: {
				userId,
				simulationId,
			},
		})

		return state || null
	}

	async create(
		userId: string,
		simulationId: string,
		scenarioId: string,
	): Promise<SimulationState> {
		const [newState] = await this.client
			.insert(simulationState)
			.values({
				userId,
				simulationId,
				lastViewedScenarioId: scenarioId,
			})
			.returning()

		return newState
	}

	async viewNewScenario(
		userId: string,
		simulationId: string,
		scenarioId: string,
	) {
		await this.client
			.update(simulationState)
			.set({
				lastViewedScenarioId: scenarioId,
			})
			.where(
				and(
					eq(simulationState.userId, userId),
					eq(simulationState.simulationId, simulationId),
				),
			)
	}

	async updateLastOpenedAt(
		userId: string,
		simulationId: string,
	): Promise<void> {
		await this.client
			.update(simulationState)
			.set({
				lastOpenedAt: new Date(),
			})
			.where(
				and(
					eq(simulationState.userId, userId),
					eq(simulationState.simulationId, simulationId),
				),
			)
	}
}
