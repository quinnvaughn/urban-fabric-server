import type { DbClient } from "../../types/db"
import { CanvasRepository } from "../canvas/canvas.repository"
import { ForbiddenError, NotFoundError, ValidationError } from "../error"
import type { Scenario } from "./scenario.model"
import { ScenarioRepository } from "./scenario.repository"

export class ScenarioService {
	private readonly repo: ScenarioRepository
	private readonly canvasRepo: CanvasRepository

	constructor(client: DbClient) {
		this.repo = new ScenarioRepository(client)
		this.canvasRepo = new CanvasRepository(client)
	}

	async createScenario(
		userId: string,
		input: { name: string; canvasId: string },
	): Promise<Scenario> {
		if (!input.name.trim()) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}

		const canvas = await this.canvasRepo.findById(input.canvasId)
		if (!canvas) {
			throw new NotFoundError("Canvas not found")
		}
		if (canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this canvas")
		}

		return await this.repo.create({
			canvasId: input.canvasId,
			name: input.name.trim(),
		})
	}

	async deleteScenario(userId: string, id: string): Promise<void> {
		const scenario = await this.repo.findById(id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const canvas = await this.canvasRepo.findById(scenario.canvasId)
		if (!canvas || canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this canvas")
		}
		await this.repo.delete(id)
	}

	async getScenario(userId: string, id: string): Promise<Scenario> {
		const scenario = await this.repo.findById(id)
		if (!scenario) {
			throw new NotFoundError("Scenario not found")
		}
		const canvas = await this.canvasRepo.findById(scenario.canvasId)
		if (!canvas || canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this canvas")
		}
		return scenario
	}

	async getScenariosByCanvasId(
		userId: string,
		canvasId: string,
	): Promise<Scenario[]> {
		const canvas = await this.canvasRepo.findById(canvasId)
		if (!canvas || canvas.userId !== userId) {
			throw new ForbiddenError("You do not own this canvas")
		}
		return this.repo.findManyByCanvasId(canvasId)
	}
}
