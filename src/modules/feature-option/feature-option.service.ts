import type { DbClient } from "../../types/db"
import type { FeatureOption } from "./feature-option.model"
import { FeatureOptionRepository } from "./feature-option.repository"

export class FeatureOptionService {
	private readonly repo: FeatureOptionRepository

	constructor(client: DbClient) {
		this.repo = new FeatureOptionRepository(client)
	}

	async findById(id: string | null | undefined): Promise<FeatureOption | null> {
		if (!id) return null
		return this.repo.findById(id)
	}

	async findManyByIds(ids: string[]): Promise<FeatureOption[]> {
		if (!ids.length) return []
		return this.repo.findByIds(ids)
	}

	async findAll(): Promise<FeatureOption[]> {
		return this.repo.findAll()
	}
}
