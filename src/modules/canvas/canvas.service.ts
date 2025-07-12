import type { DbClient } from "../../types/db"
import {
	ConflictError,
	ForbiddenError,
	InternalError,
	NotFoundError,
	ValidationError,
} from "../error"
import { ScenarioRepository } from "../scenario/scenario.repository"
import type { Canvas } from "./canvas.model"
import { CanvasRepository } from "./canvas.repository"

export class CanvasService {
	private repo: CanvasRepository

	constructor(client: DbClient) {
		this.repo = new CanvasRepository(client)
	}

	async createCanvas(
		input: { name: string; description?: string },
		userId: string,
	) {
		return this.repo.client.transaction(async (tx) => {
			const canvasRepo = new CanvasRepository(tx)
			const scenarioRepo = new ScenarioRepository(tx)

			const canvas = await canvasRepo.create(input, userId)
			if (!canvas) {
				throw new InternalError("Failed to create canvas")
			}
			// add default scenario
			await scenarioRepo.create({
				canvasId: canvas.id,
				name: "Untitled Scenario",
			})
			return canvas
		})
	}

	async getCanvas(id: string, userId: string): Promise<Canvas> {
		const canvas = await this.repo.findById(id)
		if (!canvas) {
			throw new NotFoundError(`Canvas with id ${id} not found`)
		}
		if (canvas.userId !== userId) {
			throw new ForbiddenError(
				`You do not have permission to access this canvas`,
			)
		}
		return canvas
	}

	async updateCanvas(
		id: string,
		userId: string,
		updates: Partial<Omit<Canvas, "id" | "userId" | "createdAt">>,
	) {
		await this.getCanvas(id, userId) // Ensure canvas exists and belongs to user
		if (updates.name !== undefined && !updates.name.trim()) {
			throw new ValidationError([{ field: "name", message: "Required" }])
		}
		await this.repo.update(id, updates)
	}

	async deleteCanvas(id: string, userId: string): Promise<void> {
		await this.getCanvas(id, userId)
		await this.repo.delete(id)
	}

	async publishCanvas(id: string, userId: string): Promise<string> {
		const canvas = await this.getCanvas(id, userId)
		if (canvas.published) {
			throw new ConflictError("Canvas is already published")
		}
		return this.repo.publish(id)
	}
}
