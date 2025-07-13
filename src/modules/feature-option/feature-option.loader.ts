import DataLoader from "dataloader"
import type { FeatureOption } from "./feature-option.model"
import type { FeatureOptionRepository } from "./feature-option.repository"

export function featureOptionLoaders(repo: FeatureOptionRepository) {
	return {
		byId: new DataLoader<string, FeatureOption | null>(async (ids) => {
			const rows = await repo.findByIds(ids as string[])
			const lookup = new Map(rows.map((row) => [row.id, row]))
			return ids.map((id) => lookup.get(id) ?? null)
		}),
		byCategoryIds: new DataLoader<string, FeatureOption[]>(
			async (categoryIds) => {
				const rows = await repo.findByCategoryIds(categoryIds as string[])
				const lookup = new Map<string, FeatureOption[]>()
				for (const row of rows) {
					if (!lookup.has(row.categoryId)) {
						lookup.set(row.categoryId, [])
					}
					lookup.get(row.categoryId)?.push(row)
				}
				return categoryIds.map((id) => lookup.get(id) ?? [])
			},
		),
	}
}
