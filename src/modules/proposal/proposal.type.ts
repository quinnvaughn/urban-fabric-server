import { builder } from "../../graphql/builder"
import { omitNullish } from "../../graphql/utils"
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../error"
import { Coordinate } from "../fabric/fabric.type"

builder.objectType("Proposal", {
	fields: (t) => ({
		id: t.exposeID("id"),
		fabricId: t.exposeID("fabricId"),
		creatorId: t.exposeID("creatorId"),
		title: t.exposeString("title"),
		description: t.exposeString("description", { nullable: true }),
		slug: t.exposeString("slug"),
		isPublished: t.exposeBoolean("isPublished"),
		publishedAt: t.expose("publishedAt", { type: "DateTime", nullable: true }),
		snapshotElements: t.field({
			type: "JSON",
			resolve: (proposal) =>
				proposal.snapshotElements as Record<string, unknown>,
		}),
		snapshotCenter: t.field({
			type: Coordinate,
			nullable: true,
			resolve: (proposal) => {
				if (!proposal.snapshotCenter) return null
				return {
					lng: proposal.snapshotCenter[0],
					lat: proposal.snapshotCenter[1],
				}
			},
		}),
		snapshotZoom: t.exposeFloat("snapshotZoom", { nullable: true }),
		snapshotThumbnail: t.exposeString("snapshotThumbnail", { nullable: true }),
		snapshotLocationCity: t.exposeString("snapshotLocationCity", {
			nullable: true,
		}),
		snapshotLocationRegion: t.exposeString("snapshotLocationRegion", {
			nullable: true,
		}),
		snapshotLocationCountry: t.exposeString("snapshotLocationCountry", {
			nullable: true,
		}),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
})

builder.queryFields((t) => ({
	proposal: t.field({
		type: "Proposal",
		errors: { types: [NotFoundError] },
		args: { id: t.arg.id({ required: true }) },
		resolve: (_parent, args, { services }) =>
			services.proposal.getProposalById(args.id),
	}),
	proposalBySlug: t.field({
		type: "Proposal",
		errors: { types: [NotFoundError] },
		args: { slug: t.arg.string({ required: true }) },
		resolve: (_parent, args, { services }) =>
			services.proposal.getProposalBySlug(args.slug),
	}),
	proposalsByFabricId: t.field({
		type: ["Proposal"],
		args: {
			fabricId: t.arg.id({ required: true }),
			publishedOnly: t.arg.boolean({ required: false }),
		},
		resolve: (_parent, args, { services }) =>
			services.proposal.getProposalsByFabricId(
				args.fabricId,
				args.publishedOnly ?? false,
			),
	}),
	myProposals: t.field({
		type: ["Proposal"],
		errors: { types: [UnauthorizedError] },
		resolve: (_parent, _args, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.proposal.getProposalsByCreatorId(user.id)
		},
	}),
}))

builder.mutationFields((t) => ({
	createProposal: t.fieldWithInput({
		type: "Proposal",
		errors: { types: [UnauthorizedError] },
		input: {
			fabricId: t.input.id(),
			title: t.input.string(),
			description: t.input.string({ required: false }),
			slug: t.input.string(),
		},
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.proposal.createProposal({
				...input,
				creatorId: user.id,
			})
		},
	}),
	updateProposal: t.fieldWithInput({
		type: "Proposal",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: {
			id: t.input.id(),
			title: t.input.string({ required: false }),
			description: t.input.string({ required: false }),
			slug: t.input.string({ required: false }),
		},
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			const { id, ...rest } = input
			return services.proposal.updateProposal(id, user.id, omitNullish(rest))
		},
	}),
	publishProposal: t.fieldWithInput({
		type: "Proposal",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: { id: t.input.id() },
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.proposal.publishProposal(input.id, user.id)
		},
	}),
	unpublishProposal: t.fieldWithInput({
		type: "Proposal",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: { id: t.input.id() },
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.proposal.unpublishProposal(input.id, user.id)
		},
	}),
	deleteProposal: t.fieldWithInput({
		type: "Proposal",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: { id: t.input.id() },
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.proposal.deleteProposal(input.id, user.id)
		},
	}),
}))
