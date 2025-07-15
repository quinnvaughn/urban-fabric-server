import DataLoader from "dataloader"
import type { Simulation } from "./simulation.model"
import type { SimulationRepository } from "./simulation.repository"

function createSimulationLoader(repo: SimulationRepository) {
	return new DataLoader<
		string,
		Awaited<ReturnType<typeof repo.findById>> | null
	>(async (ids: readonly string[]) => {
		const rows = await repo.findManyByIds([...ids])
		const simulationMap = new Map(
			rows.map((simulation) => [simulation.id, simulation]),
		)
		return ids.map((id) => simulationMap.get(id) || null)
	})
}

function createSimulationLoaderByUserIdLoader(repo: SimulationRepository) {
	return new DataLoader<string, Simulation[]>(async (userIds) => {
		const rows = await repo.findManyByUserIds([...userIds])
		const grouped = new Map<string, Simulation[]>()

		for (const row of rows) {
			if (!grouped.has(row.userId)) {
				grouped.set(row.userId, [])
			}
			grouped.get(row.userId)?.push(row)
		}

		return userIds.map((id) => grouped.get(id) ?? [])
	})
}

export const simulationLoaders = (repo: SimulationRepository) => ({
	byId: createSimulationLoader(repo),
	byUserId: createSimulationLoaderByUserIdLoader(repo),
})
