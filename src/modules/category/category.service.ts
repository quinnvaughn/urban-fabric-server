import type { DbClient } from "../../types/db"
import { NotFoundError } from "../error/error"
import type { Category } from "./category.model"
import { CategoryRepository } from "./category.repository"

export class CategoryService {
	private readonly repo: CategoryRepository

	constructor(client: DbClient) {
		this.repo = new CategoryRepository(client)
	}

	async findById(id: string | null | undefined): Promise<Category> {
		if (!id) throw new NotFoundError("Missing category ID")
		const category = await this.repo.findById(id)
		if (!category) throw new NotFoundError(`Category not found: ${id}`)
		return category
	}

	async findManyByIds(ids: string[]): Promise<Category[]> {
		if (!ids.length) return []
		const categories = await this.repo.findByIds(ids)

		if (categories.length !== ids.length) {
			const foundIds = new Set(categories.map((c) => c.id))
			const missing = ids.filter((id) => !foundIds.has(id))
			throw new NotFoundError(`Missing category IDs: ${missing.join(", ")}`)
		}

		return categories
	}

	async findAll(): Promise<Category[]> {
		return this.repo.findAll()
	}
}
