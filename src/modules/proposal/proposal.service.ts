import type { DbClient } from "../../types/db"
import { ForbiddenError, NotFoundError } from "../error"
import type { Proposal, ProposalInsert } from "./proposal.model"
import { ProposalRepository } from "./proposal.repository"

type ProposalUpdate = Partial<
	Omit<
		ProposalInsert,
		| "id"
		| "creatorId"
		| "fabricId"
		| "createdAt"
		| "updatedAt"
		| "isPublished"
		| "publishedAt"
	>
>

export class ProposalService {
	private repo: ProposalRepository

	constructor(dbClient: DbClient) {
		this.repo = new ProposalRepository(dbClient)
	}

	async getProposalById(id: string) {
		const proposal = await this.repo.findById(id)
		if (!proposal) throw new NotFoundError("Proposal not found")
		return proposal
	}

	async getProposalBySlug(slug: string) {
		const proposal = await this.repo.findBySlug(slug)
		if (!proposal) throw new NotFoundError("Proposal not found")
		return proposal
	}

	async getProposalsByCreatorId(creatorId: string) {
		return this.repo.findManyByCreatorId(creatorId)
	}

	async getProposalsByFabricId(fabricId: string, publishedOnly = false) {
		return this.repo.findManyByFabricId(fabricId, publishedOnly)
	}

	async createProposal(
		input: Omit<ProposalInsert, "id" | "createdAt" | "updatedAt">,
	): Promise<Proposal> {
		const proposal = await this.repo.create(input)
		if (!proposal) throw new Error("Failed to create proposal")
		return proposal
	}

	async updateProposal(
		id: string,
		userId: string,
		input: ProposalUpdate,
	): Promise<Proposal> {
		const proposal = await this.repo.findById(id)
		if (!proposal) throw new NotFoundError("Proposal not found")
		if (proposal.creatorId !== userId)
			throw new ForbiddenError("You do not own this proposal")
		const updated = await this.repo.update(id, input)
		if (!updated) throw new NotFoundError("Proposal not found")
		return updated
	}

	async publishProposal(id: string, userId: string): Promise<Proposal> {
		const proposal = await this.repo.findById(id)
		if (!proposal) throw new NotFoundError("Proposal not found")
		if (proposal.creatorId !== userId)
			throw new ForbiddenError("You do not own this proposal")
		const updated = await this.repo.update(id, {
			isPublished: true,
			publishedAt: new Date(),
		})
		if (!updated) throw new NotFoundError("Proposal not found")
		return updated
	}

	async unpublishProposal(id: string, userId: string): Promise<Proposal> {
		const proposal = await this.repo.findById(id)
		if (!proposal) throw new NotFoundError("Proposal not found")
		if (proposal.creatorId !== userId)
			throw new ForbiddenError("You do not own this proposal")
		const updated = await this.repo.update(id, {
			isPublished: false,
			publishedAt: null,
		})
		if (!updated) throw new NotFoundError("Proposal not found")
		return updated
	}

	async deleteProposal(id: string, userId: string): Promise<Proposal> {
		const proposal = await this.repo.findById(id)
		if (!proposal) throw new NotFoundError("Proposal not found")
		if (proposal.creatorId !== userId)
			throw new ForbiddenError("You do not own this proposal")
		const deleted = await this.repo.delete(id)
		if (!deleted) throw new NotFoundError("Proposal not found")
		return deleted
	}
}
