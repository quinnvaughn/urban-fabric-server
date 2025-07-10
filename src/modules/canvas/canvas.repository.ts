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

	async findById(id: string): Promise<Canvas | null> {
		const canvas = await this.client.query.canvases.findFirst({
			where: { id },
		})
		return canvas ?? null
	}

	async publish(id: string): Promise<string> {
		const canvas = await this.findById(id)
		if (!canvas) throw new Error("Canvas not found")
		const base = slugify(canvas.name, { lower: true, strict: true })
		let slug = base,
			suffix = 1
		while (await this.client.query.canvases.findFirst({ where: { slug } })) {
			slug = `${base}-${suffix}`
			suffix++
		}
		await this.client
			.update(canvases)
			.set({ slug, published: true })
			.where(eq(canvases.id, id))
		return slug
	}
}
