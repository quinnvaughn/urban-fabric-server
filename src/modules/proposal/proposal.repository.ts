import { eq } from "drizzle-orm"
import type { DbClient } from "../../types/db"
import { type ProposalInsert, proposals } from "./proposal.model"

type ProposalUpdate = Partial<
	Omit<
		ProposalInsert,
		"id" | "creatorId" | "fabricId" | "createdAt" | "updatedAt"
	>
>

export class ProposalRepository {
	constructor(readonly client: DbClient) {}

	async findById(id: string) {
		return this.client.query.proposals.findFirst({
			where: { id },
		})
	}

	async findBySlug(slug: string) {
		return this.client.query.proposals.findFirst({
			where: { slug },
		})
	}

	async findManyByCreatorId(creatorId: string) {
		return this.client.query.proposals.findMany({
			where: { creatorId },
		})
	}

	async findManyByFabricId(fabricId: string, publishedOnly = false) {
		return this.client.query.proposals.findMany({
			where: publishedOnly ? { fabricId, isPublished: true } : { fabricId },
		})
	}

	async create(input: ProposalInsert) {
		return this.client
			.insert(proposals)
			.values(input)
			.returning()
			.then(([proposal]) => proposal)
	}

	async update(id: string, input: ProposalUpdate) {
		return this.client
			.update(proposals)
			.set(input)
			.where(eq(proposals.id, id))
			.returning()
			.then(([proposal]) => proposal)
	}

	async delete(id: string) {
		return this.client
			.delete(proposals)
			.where(eq(proposals.id, id))
			.returning()
			.then(([proposal]) => proposal)
	}
}
