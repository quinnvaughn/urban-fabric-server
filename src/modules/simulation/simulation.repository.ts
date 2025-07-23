import { eq } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type Simulation, simulations } from "./simulation.model"

export class SimulationRepository {
	constructor(readonly client: DbClient) {}

	async create(input: { name: string }, userId: string): Promise<Simulation> {
		const [s] = await this.client
			.insert(simulations)
			.values({ userId, ...input })
			.returning()
		return s
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
