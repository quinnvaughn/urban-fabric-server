import { eq } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type FabricInsert, fabrics } from "./fabric.model"

type FabricUpdate = Partial<
	Omit<FabricInsert, "id" | "creatorId" | "createdAt" | "updatedAt">
>

export class FabricRepository {
	constructor(readonly client: DbClient) {}

	async findById(id: string) {
		return this.client.query.fabrics.findFirst({
			where: { id },
		})
	}

	async findManyByCreatorId(creatorId: string, options?: { limit?: number }) {
		return this.client.query.fabrics.findMany({
			where: { creatorId },
			orderBy: { updatedAt: "desc" },
			limit: options?.limit,
		})
	}

	async create(input: FabricInsert) {
		return this.client
			.insert(fabrics)
			.values(input)
			.returning()
			.then(([fabric]) => fabric)
	}

	async update(id: string, input: FabricUpdate) {
		return this.client
			.update(fabrics)
			.set(input)
			.where(eq(fabrics.id, id))
			.returning()
			.then(([fabric]) => fabric)
	}

	async delete(id: string) {
		return this.client
			.delete(fabrics)
			.where(eq(fabrics.id, id))
			.returning()
			.then(([fabric]) => fabric)
	}
}
