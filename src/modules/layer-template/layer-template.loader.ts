import DataLoader from "dataloader"
import type { LayerTemplate } from "./layer-template.model"
import type { LayerTemplateRepository } from "./layer-template.repository"

export function layerTemplateLoaders(repo: LayerTemplateRepository) {
	return {
		byId: new DataLoader<string, LayerTemplate | null>(async (ids) => {
			const rows = await repo.findByIds(ids as string[])
			const lookup = new Map(rows.map((row) => [row.id, row]))
			return ids.map((id) => lookup.get(id) ?? null)
		}),
		byCategoryIds: new DataLoader<string, LayerTemplate[]>(
			async (categoryIds) => {
				const rows = await repo.findByCategoryIds(categoryIds as string[])
				const lookup = new Map<string, LayerTemplate[]>()
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
