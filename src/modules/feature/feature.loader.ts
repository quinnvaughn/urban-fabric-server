import DataLoader from "dataloader"
import type { Feature } from "./feature.model"
import type { FeatureRepository } from "./feature.repository"

const byScenarioFeatureLoader = (repo: FeatureRepository) =>
	new DataLoader(async (scenarioIds: readonly string[]) => {
		const features = await repo.findByScenarioIds(scenarioIds as string[])
		const grouped = new Map<string, Feature[]>()
		for (const feature of features) {
			if (!grouped.has(feature.scenarioId)) grouped.set(feature.scenarioId, [])
			grouped.get(feature.scenarioId)?.push(feature)
		}
		return scenarioIds.map((id) => grouped.get(id) ?? [])
	})

export const featureLoaders = (repo: FeatureRepository) => ({
	byScenarioId: byScenarioFeatureLoader(repo),
})
