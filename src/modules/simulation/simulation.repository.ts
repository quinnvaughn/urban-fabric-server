import { eq } from "drizzle-orm"
import slugify from "slugify"
import type { DbClient } from "../../types/db"
import { type Simulation, simulations } from "./simulation.model"

export class SimulationRepository {
	constructor(readonly client: DbClient) {}

	async create(
		input: { name: string; description?: string },
		userId: string,
	): Promise<Simulation> {
		const [simulation] = await this.client.transaction(async (tx) => {
			const [s] = await tx
				.insert(simulations)
				.values({ userId, ...input })
				.returning()
			return [s]
		})
		return simulation
	}

	async delete(id: string): Promise<void> {
		const simulation = await this.findById(id)
		if (!simulation) throw new Error("Simulation not found")
		await this.client.delete(simulations).where(eq(simulations.id, id))
	}

	async findManyByIds(ids: string[]): Promise<Simulation[]> {
		const simulations = await this.client.query.simulations.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		})
		return simulations
	}

	async findById(id: string): Promise<Simulation | null> {
		const simulation = await this.client.query.simulations.findFirst({
			where: { id },
		})
		return simulation ?? null
	}

	async publish(id: string): Promise<string> {
		return this.client.transaction(async (tx) => {
			const repoTx = new SimulationRepository(tx)

			const canvas = await repoTx.findById(id)
			if (!canvas) throw new Error("Simulation not found")

			const base = slugify(canvas.name, { lower: true, strict: true })
			let slug = base
			let suffix = 1

			// loop inside transaction to ensure uniqueness
			while (await tx.query.simulations.findFirst({ where: { slug } })) {
				slug = `${base}-${suffix++}`
			}

			await tx
				.update(simulations)
				.set({ slug, published: true, updatedAt: new Date() })
				.where(eq(simulations.id, id))

			return slug
		})
	}

	async findByUserId(userId: string): Promise<Simulation[]> {
		const simulations = await this.client.query.simulations.findMany({
			where: { userId },
		})
		return simulations
	}

	async findManyByUserIds(
		userIds: string[],
		orderBy: "asc" | "desc" = "desc",
	): Promise<Simulation[]> {
		const simulations = await this.client.query.simulations.findMany({
			where: {
				userId: {
					in: userIds,
				},
			},
			orderBy: {
				updatedAt: orderBy,
			},
		})
		return simulations
	}

	async update(
		id: string,
		updates: Partial<Omit<Simulation, "id" | "userId" | "createdAt">>,
	): Promise<void> {
		await this.client
			.update(simulations)
			.set(updates)
			.where(eq(simulations.id, id))
			.execute()
	}
}
