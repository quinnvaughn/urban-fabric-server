import DataLoader from "dataloader"
import type { ScenarioFeature } from "./scenario-feature.model"
import type { ScenarioFeatureRepository } from "./scenario-feature.repository"

const scenarioFeatureLoader = (repo: ScenarioFeatureRepository) =>
	new DataLoader(async (scenarioIds: readonly string[]) => {
		const features = await repo.findByScenarioIds(scenarioIds as string[])
		const grouped = new Map<string, ScenarioFeature[]>()
		for (const feature of features) {
			if (!grouped.has(feature.scenarioId)) grouped.set(feature.scenarioId, [])
			grouped.get(feature.scenarioId)?.push(feature)
		}
		return scenarioIds.map((id) => grouped.get(id) ?? [])
	})

export const scenarioFeatureLoaders = (repo: ScenarioFeatureRepository) => ({
	byId: scenarioFeatureLoader(repo),
})
