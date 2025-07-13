import { db } from "../db"
import type { CategoryInsert } from "../db/schema"
import { CategoryRepository } from "../modules/category/category.repository"

const DEFAULT_CATEGORIES: CategoryInsert[] = [
	{
		id: "streets",
		label: "Streets",
		icon: "Signpost",
		order: 1,
	},
	{
		id: "buildings",
		label: "Buildings",
		icon: "Building",
		order: 2,
	},
	{
		id: "transit",
		label: "Transit",
		icon: "Bus",
		order: 3,
	},
]

export async function seedCategories() {
	const repo = new CategoryRepository(db)

	for (const category of DEFAULT_CATEGORIES) {
		await repo.upsert(category)
	}
	console.log("✅ Seeded categories")
}
