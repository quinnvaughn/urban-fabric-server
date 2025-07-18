import DataLoader from "dataloader"
import type { LayerInstance } from "./layer-instance.model"
import type { LayerInstanceRepository } from "./layer-instance.repository"

const byScenarioLayerInstanceLoader = (repo: LayerInstanceRepository) =>
	new DataLoader(async (scenarioIds: readonly string[]) => {
		const layerInstances = await repo.findByScenarioIds(scenarioIds as string[])
		const grouped = new Map<string, LayerInstance[]>()
		for (const layerInstance of layerInstances) {
			if (!grouped.has(layerInstance.scenarioId))
				grouped.set(layerInstance.scenarioId, [])
			grouped.get(layerInstance.scenarioId)?.push(layerInstance)
		}
		return scenarioIds.map((id) => grouped.get(id) ?? [])
	})

export const layerInstanceLoaders = (repo: LayerInstanceRepository) => ({
	byScenarioId: byScenarioLayerInstanceLoader(repo),
})
