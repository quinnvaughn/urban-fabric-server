import { asc, eq, sql } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type Scenario, scenarios } from "./scenario.model"

export class ScenarioRepository {
	constructor(readonly client: DbClient) {}

	async create(input: { name: string; canvasId: string }): Promise<Scenario> {
		const scenario = await this.client.transaction(async (tx) => {
			// lock the scenario
			await tx.execute(
				sql`SELECT 1 FROM ${scenarios} WHERE ${scenarios.canvasId} = ${input.canvasId} FOR UPDATE`,
			)
			// get the current max position for the canvas
			const maxPosition = await tx
				.select({
					max: sql<number>`MAX(${scenarios.position}) `,
				})
				.from(scenarios)
				.where(eq(scenarios.canvasId, input.canvasId))
			const [s] = await tx
				.insert(scenarios)
				.values({ ...input, position: (maxPosition[0]?.max ?? 0) + 1 })
				.returning()
			return s
		})
		return scenario
	}

	async delete(id: string): Promise<void> {
		const scenario = await this.findById(id)
		if (!scenario) throw new Error("Scenario not found")
		await this.client.delete(scenarios).where(eq(scenarios.id, id))
	}

	async findById(id: string): Promise<Scenario | null> {
		const scenario = await this.client.query.scenarios.findFirst({
			where: { id },
		})
		return scenario ?? null
	}

	async findManyByIds(ids: string[]): Promise<Scenario[]> {
		const scenarios = await this.client.query.scenarios.findMany({
			where: {
				id: { in: ids },
			},
		})
		return scenarios
	}

	async findManyByCanvasId(canvasId: string): Promise<Scenario[]> {
		const scenarios = await this.client.query.scenarios.findMany({
			where: {
				canvasId,
			},
			orderBy: (scenarios) => [asc(scenarios.position)],
		})
		return scenarios
	}

	async findManyByCanvasIds(canvasIds: string[]): Promise<Scenario[]> {
		const scenarios = await this.client.query.scenarios.findMany({
			where: {
				canvasId: { in: canvasIds },
			},
			orderBy: (scenarios) => [asc(scenarios.position)],
		})
		return scenarios
	}
}
