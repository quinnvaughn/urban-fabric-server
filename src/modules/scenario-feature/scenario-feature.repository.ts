import type { Geometry } from "geojson"
import type { DbClient } from "../../types/db"
import {
	type ScenarioFeature,
	scenarioFeatures,
} from "./scenario-feature.model"

export class ScenarioFeatureRepository {
	constructor(private readonly client: DbClient) {}

	async findByScenarioIds(scenarioIds: string[]): Promise<ScenarioFeature[]> {
		return await this.client.query.scenarioFeatures.findMany({
			where: { scenarioId: { in: scenarioIds } },
		})
	}

	async create(input: {
		scenarioId: string
		type: string
		geometry: Geometry
		properties: Record<string, unknown>
	}): Promise<ScenarioFeature> {
		const [feature] = await this.client
			.insert(scenarioFeatures)
			.values(input)
			.returning()

		return feature
	}
}
