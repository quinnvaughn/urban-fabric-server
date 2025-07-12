import { eq } from "drizzle-orm"
import slugify from "slugify"
import type { DbClient } from "../../types/db"
import { type Canvas, canvases } from "./canvas.model"

export class CanvasRepository {
	constructor(readonly client: DbClient) {}

	async create(
		input: { name: string; description?: string },
		userId: string,
	): Promise<Canvas> {
		const [canvas] = await this.client.transaction(async (tx) => {
			const [c] = await tx
				.insert(canvases)
				.values({ userId, ...input })
				.returning()
			return [c]
		})
		return canvas
	}

	async delete(id: string): Promise<void> {
		const canvas = await this.findById(id)
		if (!canvas) throw new Error("Canvas not found")
		await this.client.delete(canvases).where(eq(canvases.id, id))
	}

	async findById(id: string): Promise<Canvas | null> {
		const canvas = await this.client.query.canvases.findFirst({
			where: { id },
		})
		return canvas ?? null
	}

	async publish(id: string): Promise<string> {
		return this.client.transaction(async (tx) => {
			const repoTx = new CanvasRepository(tx)

			const canvas = await repoTx.findById(id)
			if (!canvas) throw new Error("Canvas not found")

			const base = slugify(canvas.name, { lower: true, strict: true })
			let slug = base
			let suffix = 1

			// loop inside transaction to ensure uniqueness
			while (await tx.query.canvases.findFirst({ where: { slug } })) {
				slug = `${base}-${suffix++}`
			}

			await tx
				.update(canvases)
				.set({ slug, published: true, updatedAt: new Date() })
				.where(eq(canvases.id, id))

			return slug
		})
	}

	async update(
		id: string,
		updates: Partial<Omit<Canvas, "id" | "userId" | "createdAt">>,
	): Promise<void> {
		await this.client
			.update(canvases)
			.set(updates)
			.where(eq(canvases.id, id))
			.execute()
	}
}
