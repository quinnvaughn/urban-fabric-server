import type { DbClient } from "../../types/db"
import {
	type Category,
	type CategoryInsert,
	categories,
} from "./category.model"

export class CategoryRepository {
	constructor(private readonly client: DbClient) {}

	async upsert(input: CategoryInsert): Promise<Category> {
		const [row] = await this.client
			.insert(categories)
			.values(input)
			.onConflictDoUpdate({
				target: categories.id,
				set: {
					label: input.label,
					icon: input.icon,
					order: input.order,
				},
			})
			.returning()
		return row
	}

	async findById(id: string): Promise<Category | null> {
		const category = await this.client.query.categories.findFirst({
			where: {
				id,
			},
		})
		return category || null
	}

	async findByIds(ids: string[]): Promise<Category[]> {
		return this.client.query.categories.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		})
	}

	async findAll(): Promise<Category[]> {
		return this.client.query.categories.findMany({
			orderBy: (c, { asc }) => asc(c.order),
		})
	}
}
