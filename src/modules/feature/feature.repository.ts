import type { Geometry } from "geojson"
import type { DbClient } from "../../types/db"
import { type Feature, type FeatureInsert, features } from "./feature.model"

export class FeatureRepository {
	constructor(private readonly client: DbClient) {}

	async findByScenarioIds(scenarioIds: string[]): Promise<Feature[]> {
		return await this.client.query.features.findMany({
			where: { scenarioId: { in: scenarioIds } },
		})
	}

	async create(input: {
		scenarioId: string
		type: string
		geometry: Geometry
		properties: Record<string, unknown>
	}): Promise<Feature> {
		const [feature] = await this.client
			.insert(features)
			.values(input)
			.returning()

		return feature
	}

	async findById(id: string): Promise<Feature | null> {
		const feature = await this.client.query.features.findFirst({
			where: { id },
		})
		return feature || null
	}

	async upsert(input: FeatureInsert): Promise<Feature> {
		const [feature] = await this.client
			.insert(features)
			.values(input)
			.onConflictDoUpdate({
				target: features.id,
				set: {
					scenarioId: input.scenarioId,
					optionId: input.optionId,
					geometry: input.geometry,
					properties: input.properties,
				},
			})
			.returning()

		return feature
	}
}
