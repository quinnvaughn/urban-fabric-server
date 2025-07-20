import type { DbClient } from "../../types/db"
import {
	type LayerTemplate,
	type LayerTemplateInsert,
	layerTemplates,
} from "./layer-template.model"

export class LayerTemplateRepository {
	constructor(private readonly client: DbClient) {}

	async findAll(): Promise<LayerTemplate[]> {
		return this.client.query.layerTemplates.findMany()
	}

	async findById(id: string): Promise<LayerTemplate | null> {
		const option = await this.client.query.layerTemplates.findFirst({
			where: {
				id,
			},
		})
		return option || null
	}

	async findByIds(ids: string[]): Promise<LayerTemplate[]> {
		return this.client.query.layerTemplates.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		})
	}

	async findByCategory(categoryId: string): Promise<LayerTemplate[]> {
		return this.client.query.layerTemplates.findMany({
			where: {
				categoryId,
			},
		})
	}

	async findByCategoryIds(categoryIds: string[]): Promise<LayerTemplate[]> {
		return this.client.query.layerTemplates.findMany({
			where: {
				categoryId: {
					in: categoryIds,
				},
			},
		})
	}

	async create(input: LayerTemplateInsert): Promise<LayerTemplate> {
		const [row] = await this.client
			.insert(layerTemplates)
			.values(input)
			.returning()
		return row
	}

	async upsert(input: LayerTemplateInsert): Promise<LayerTemplate> {
		const [row] = await this.client
			.insert(layerTemplates)
			.values(input)
			.onConflictDoUpdate({
				target: layerTemplates.id,
				set: input,
			})
			.returning()
		return row
	}
}
