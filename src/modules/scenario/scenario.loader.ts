import DataLoader from "dataloader"
import type { Scenario } from "./scenario.model"
import type { ScenarioRepository } from "./scenario.repository"

function createScenarioLoader(repo: ScenarioRepository) {
	return new DataLoader<
		string,
		Awaited<ReturnType<typeof repo.findById>> | null
	>(async (ids: readonly string[]) => {
		const rows = await repo.findManyByIds([...ids])
		const scenarioMap = new Map(rows.map((scenario) => [scenario.id, scenario]))
		return ids.map((id) => scenarioMap.get(id) || null)
	})
}

function createScenariosByCanvasIdLoader(repo: ScenarioRepository) {
	return new DataLoader<
		string,
		Awaited<ReturnType<typeof repo.findManyByCanvasId>> | null
	>(async (simulationIds: readonly string[]) => {
		const rows = await repo.findManyByCanvasIds([...simulationIds])

		// Group scenarios by simulationId
		const map = new Map<string, Scenario[]>()
		for (const scenario of rows) {
			if (!map.has(scenario.simulationId)) {
				map.set(scenario.simulationId, [])
			}
			map.get(scenario.simulationId)?.push(scenario)
		}

		return simulationIds.map((id) => map.get(id) ?? [])
	})
}

export const scenarioLoaders = (repo: ScenarioRepository) => ({
	byId: createScenarioLoader(repo),
	byCanvasId: createScenariosByCanvasIdLoader(repo),
})
