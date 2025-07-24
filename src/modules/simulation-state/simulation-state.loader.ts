import DataLoader from "dataloader"
import type { SimulationState } from "./simulation-state.model"
import type { SimulationStateRepository } from "./simulation-state.repository"

const createSimulationStateLoaderByUserAndSimulationId = (
	repo: SimulationStateRepository,
) => {
	return new DataLoader<
		{ userId: string; simulationId: string },
		Awaited<ReturnType<typeof repo.findByUserIdAndSimulationId>> | null
	>(async (keys: readonly { userId: string; simulationId: string }[]) => {
		const rows = await Promise.all(
			keys.map(({ userId, simulationId }) =>
				repo.findByUserIdAndSimulationId(userId, simulationId),
			),
		)
		const stateMap = new Map<string, SimulationState | null>()
		rows.forEach((state) => {
			if (state) {
				stateMap.set(`${state.userId}-${state.simulationId}`, state)
			}
		})
		return keys.map(
			({ userId, simulationId }) =>
				stateMap.get(`${userId}-${simulationId}`) || null,
		)
	})
}

export const simulationStateLoaders = (repo: SimulationStateRepository) => ({
	byUserAndSimulationId: createSimulationStateLoaderByUserAndSimulationId(repo),
})
