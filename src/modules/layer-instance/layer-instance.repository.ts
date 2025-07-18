import type { DbClient } from "../../types/db"
import {
	type LayerInstance,
	type LayerInstanceInsert,
	layerInstances,
} from "./layer-instance.model"

export class LayerInstanceRepository {
	constructor(private readonly client: DbClient) {}

	async findByScenarioIds(scenarioIds: string[]): Promise<LayerInstance[]> {
		return await this.client.query.layerInstances.findMany({
			where: { scenarioId: { in: scenarioIds } },
		})
	}

	async create(input: LayerInstanceInsert): Promise<LayerInstance> {
		const [layerInstance] = await this.client
			.insert(layerInstances)
			.values(input)
			.returning()

		return layerInstance
	}

	async findById(id: string): Promise<LayerInstance | null> {
		const layerInstance = await this.client.query.layerInstances.findFirst({
			where: { id },
		})
		return layerInstance || null
	}

	async upsert(input: LayerInstanceInsert): Promise<LayerInstance> {
		const [layerInstance] = await this.client
			.insert(layerInstances)
			.values(input)
			.onConflictDoUpdate({
				target: layerInstances.id,
				set: {
					scenarioId: input.scenarioId,
					templateId: input.templateId,
					geometry: input.geometry,
					properties: input.properties,
				},
			})
			.returning()

		return layerInstance
	}
}
