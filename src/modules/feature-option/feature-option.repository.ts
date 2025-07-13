import type { DbClient } from "../../types/db"
import {
	type FeatureOption,
	type FeatureOptionInsert,
	featureOptions,
} from "./feature-option.model"

export class FeatureOptionRepository {
	constructor(private readonly client: DbClient) {}

	async findAll(): Promise<FeatureOption[]> {
		return this.client.query.featureOptions.findMany()
	}

	async findById(id: string): Promise<FeatureOption | null> {
		const option = await this.client.query.featureOptions.findFirst({
			where: {
				id,
			},
		})
		return option || null
	}

	async findByIds(ids: string[]): Promise<FeatureOption[]> {
		return this.client.query.featureOptions.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		})
	}

	async findByCategory(categoryId: string): Promise<FeatureOption[]> {
		return this.client.query.featureOptions.findMany({
			where: {
				categoryId,
			},
		})
	}

	async create(input: FeatureOptionInsert): Promise<FeatureOption> {
		const [row] = await this.client
			.insert(featureOptions)
			.values(input)
			.returning()
		return row
	}

	async upsert(input: FeatureOptionInsert): Promise<FeatureOption> {
		const [row] = await this.client
			.insert(featureOptions)
			.values(input)
			.onConflictDoUpdate({
				target: featureOptions.id,
				set: {
					label: input.label,
					categoryId: input.categoryId,
					geometryType: input.geometryType,
					description: input.description,
					icon: input.icon,
					propertiesSchema: input.propertiesSchema,
				},
			})
			.returning()
		return row
	}
}
