import type { DbClient } from "../../types/db"
import type { LayerTemplate } from "./layer-template.model"
import { LayerTemplateRepository } from "./layer-template.repository"

export class LayerTemplateService {
	private readonly repo: LayerTemplateRepository

	constructor(client: DbClient) {
		this.repo = new LayerTemplateRepository(client)
	}

	async findById(id: string | null | undefined): Promise<LayerTemplate | null> {
		if (!id) return null
		return this.repo.findById(id)
	}

	async findManyByIds(ids: string[]): Promise<LayerTemplate[]> {
		if (!ids.length) return []
		return this.repo.findByIds(ids)
	}

	async findAll(): Promise<LayerTemplate[]> {
		return this.repo.findAll()
	}
}
