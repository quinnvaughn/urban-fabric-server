import { sql } from "drizzle-orm"
import { db } from "../../db"
import { canvases } from "../simulation/simulation.model"
import { users } from "../user/user.model"
import { ScenarioRepository } from "./scenario.repository"

describe("Scenario Repository", () => {
	let userId: string
	let canvasId: string
	beforeEach(async () => {
		vi.resetAllMocks()

		try {
			await db.execute(
				sql`TRUNCATE TABLE "scenarios", "canvases", "users" RESTART IDENTITY CASCADE;`,
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

			const [canvas] = await db
				.insert(canvases)
				.values({
					name: "Test Canvas",
					userId: userId,
				})
				.returning()

			canvasId = canvas.id
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
			canvasId,
		})

		expect(scenario).toHaveProperty("id")
		expect(scenario.name).toBe("Test Scenario")
		expect(scenario.canvasId).toBe(canvasId)
	})
	it("assigns position=1 for first scenario", async () => {
		const repo = new ScenarioRepository(db)
		const scenario = await repo.create({
			name: "Test Scenario",
			canvasId,
		})

		expect(scenario.position).toBe(1)
	})
	it("assigns incremented position for additional scenarios", async () => {
		const repo = new ScenarioRepository(db)

		await repo.create({ name: "First", canvasId })
		const second = await repo.create({ name: "Second", canvasId })

		expect(second.position).toBe(2)
	})
	it("resets position per canvas", async () => {
		const repo = new ScenarioRepository(db)

		// canvas A
		await repo.create({ name: "A1", canvasId })
		await repo.create({ name: "A2", canvasId })

		// canvas B
		const [canvasB] = await db
			.insert(canvases)
			.values({ name: "Canvas B", userId })
			.returning()

		const scenarioB = await repo.create({
			name: "B1",
			canvasId: canvasB.id,
		})

		expect(scenarioB.position).toBe(1)
	})
	it("delete -> removes scenario by id", async () => {
		const repo = new ScenarioRepository(db)

		const scenario = await repo.create({
			name: "Test Scenario",
			canvasId,
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
