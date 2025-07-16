import { sql } from "drizzle-orm"
import { db } from "../../db"
import { simulations } from "../simulation/simulation.model"
import { users } from "../user/user.model"
import { ScenarioRepository } from "./scenario.repository"

describe("Scenario Repository", () => {
	let userId: string
	let simulationId: string
	beforeEach(async () => {
		vi.resetAllMocks()

		try {
			await db.execute(
				sql`TRUNCATE TABLE "scenarios", "simulations", "users" RESTART IDENTITY CASCADE;`,
			)
			const [user] = await db
				.insert(users)
				.values({
					name: "Test User",
					email: "test@example.com",
					hashedPassword: "hashed",
				})
				.returning()
			userId = user.id

			const [simulation] = await db
				.insert(simulations)
				.values({
					name: "Test Canvas",
					userId: userId,
				})
				.returning()

			simulationId = simulation.id
		} catch (err) {
			console.error("Failed to reset DB before test:", err)
			throw err
		}
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it("create -> inserts new scenario with position", async () => {
		const repo = new ScenarioRepository(db)
		const scenario = await repo.create({
			name: "Test Scenario",
			simulationId,
		})

		expect(scenario).toHaveProperty("id")
		expect(scenario.name).toBe("Test Scenario")
		expect(scenario.simulationId).toBe(simulationId)
	})
	it("assigns position=1 for first scenario", async () => {
		const repo = new ScenarioRepository(db)
		const scenario = await repo.create({
			name: "Test Scenario",
			simulationId,
		})

		expect(scenario.position).toBe(1)
	})
	it("assigns incremented position for additional scenarios", async () => {
		const repo = new ScenarioRepository(db)

		await repo.create({ name: "First", simulationId })
		const second = await repo.create({ name: "Second", simulationId })

		expect(second.position).toBe(2)
	})
	it("resets position per simulation", async () => {
		const repo = new ScenarioRepository(db)

		// simulation A
		await repo.create({ name: "A1", simulationId })
		await repo.create({ name: "A2", simulationId })

		// simulation B
		const [simulationB] = await db
			.insert(simulations)
			.values({ name: "Simulation B", userId })
			.returning()

		const scenarioB = await repo.create({
			name: "B1",
			simulationId: simulationB.id,
		})

		expect(scenarioB.position).toBe(1)
	})
	it("delete -> removes scenario by id", async () => {
		const repo = new ScenarioRepository(db)

		const scenario = await repo.create({
			name: "Test Scenario",
			simulationId,
		})
		await repo.delete(scenario.id)
		expect(await repo.findById(scenario.id)).toBeNull()
	})
	it("delete -> throws if scenario not found", async () => {
		const repo = new ScenarioRepository(db)

		await expect(repo.delete("nonexistent-id")).rejects.toThrow(
			"Scenario not found",
		)
	})
})
