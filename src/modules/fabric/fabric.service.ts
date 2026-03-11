import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error"
import type { Fabric, FabricInsert } from "./fabric.model"
import { FabricRepository } from "./fabric.repository"

export class FabricService {
	private repo: FabricRepository

	constructor(dbClient: DbClient) {
		this.repo = new FabricRepository(dbClient)
	}

	async getFabricById(id: string) {
		const fabric = await this.repo.findById(id)
		if (!fabric) throw new NotFoundError("Fabric not found")
		return fabric
	}

	async getFabricsByCreatorId(creatorId: string) {
		return this.repo.findManyByCreatorId(creatorId)
	}

	async createFabric(
		input: Omit<FabricInsert, "id" | "createdAt" | "updatedAt">,
	): Promise<Fabric> {
		const fabric = await this.repo.create(input)
		if (!fabric) throw new Error("Failed to create fabric")
		return fabric
	}

	async syncViewport(
		id: string,
		userId: string,
		viewport: {
			center: [number, number]
			zoom: number
			pitch: number
			bearing: number
		},
	): Promise<Fabric> {
		const fabric = await this.repo.findById(id)
		if (!fabric) throw new NotFoundError("Fabric not found")
		if (fabric.creatorId !== userId)
			throw new ForbiddenError("You do not own this fabric")
		const updated = await this.repo.update(id, {
			viewportCenter: viewport.center,
			viewportZoom: viewport.zoom,
			viewportPitch: viewport.pitch,
			viewportBearing: viewport.bearing,
		})
		if (!updated) throw new NotFoundError("Fabric not found")
		return updated
	}

	async saveView(id: string, userId: string): Promise<Fabric> {
		const fabric = await this.repo.findById(id)
		if (!fabric) throw new NotFoundError("Fabric not found")
		if (fabric.creatorId !== userId)
			throw new ForbiddenError("You do not own this fabric")
		const updated = await this.repo.update(id, {
			originCenter: fabric.viewportCenter,
			originZoom: fabric.viewportZoom,
			originPitch: fabric.viewportPitch,
			originBearing: fabric.viewportBearing,
		})
		if (!updated) throw new NotFoundError("Fabric not found")
		return updated
	}

	async updateTitle(
		id: string,
		userId: string,
		title: string,
	): Promise<Fabric> {
		const fabric = await this.repo.findById(id)
		if (!fabric) throw new NotFoundError("Fabric not found")
		if (fabric.creatorId !== userId)
			throw new ForbiddenError("You do not own this fabric")
		const updated = await this.repo.update(id, { title })
		if (!updated) throw new NotFoundError("Fabric not found")
		return updated
	}

	async deleteFabric(id: string, userId: string): Promise<Fabric> {
		const fabric = await this.repo.findById(id)
		if (!fabric) throw new NotFoundError("Fabric not found")
		if (fabric.creatorId !== userId)
			throw new ForbiddenError("You do not own this fabric")
		const deleted = await this.repo.delete(id)
		if (!deleted) throw new NotFoundError("Fabric not found")
		return deleted
	}
}
