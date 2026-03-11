import { builder } from "../../graphql/builder"
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../error"

const Coordinate = builder.simpleObject("Coordinate", {
	fields: (t) => ({
		lng: t.float(),
		lat: t.float(),
	}),
})

const CoordinateInput = builder.inputType("CoordinateInput", {
	fields: (t) => ({
		lng: t.float(),
		lat: t.float(),
	}),
})

builder.objectType("Fabric", {
	fields: (t) => ({
		id: t.exposeID("id"),
		creatorId: t.exposeID("creatorId"),
		changes: t.field({
			type: "JSON",
			resolve: (fabric) => fabric.changes as Record<string, unknown>,
		}),
		originCenter: t.field({
			type: Coordinate,
			resolve: (fabric) => ({
				lng: fabric.originCenter[0],
				lat: fabric.originCenter[1],
			}),
		}),
		originZoom: t.exposeFloat("originZoom"),
		originPitch: t.exposeFloat("originPitch"),
		originBearing: t.exposeFloat("originBearing"),
		viewportCenter: t.field({
			type: Coordinate,
			resolve: (fabric) => ({
				lng: fabric.viewportCenter[0],
				lat: fabric.viewportCenter[1],
			}),
		}),
		viewportZoom: t.exposeFloat("viewportZoom"),
		viewportPitch: t.exposeFloat("viewportPitch"),
		viewportBearing: t.exposeFloat("viewportBearing"),
		title: t.exposeString("title"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
		updatedAt: t.expose("updatedAt", { type: "DateTime" }),
	}),
})

builder.queryFields((t) => ({
	fabric: t.field({
		type: "Fabric",
		errors: { types: [NotFoundError] },
		args: { id: t.arg.id({ required: true }) },
		resolve: (_parent, args, { services }) =>
			services.fabric.getFabricById(args.id),
	}),
	myFabrics: t.field({
		type: ["Fabric"],
		errors: { types: [UnauthorizedError] },
		resolve: (_parent, _args, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.fabric.getFabricsByCreatorId(user.id)
		},
	}),
}))

builder.mutationFields((t) => ({
	createFabric: t.fieldWithInput({
		type: "Fabric",
		errors: { types: [UnauthorizedError] },
		input: {
			center: t.input.field({ type: CoordinateInput }),
		},
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			const center: [number, number] = [input.center.lng, input.center.lat]
			return services.fabric.createFabric({
				creatorId: user.id,
				originCenter: center,
				originZoom: 12,
				originPitch: 0,
				originBearing: 0,
				viewportCenter: center,
				viewportZoom: 12,
				viewportPitch: 0,
				viewportBearing: 0,
			})
		},
	}),
	syncViewport: t.fieldWithInput({
		type: "Fabric",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: {
			id: t.input.id(),
			center: t.input.field({ type: CoordinateInput }),
			zoom: t.input.float(),
			pitch: t.input.float(),
			bearing: t.input.float(),
		},
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.fabric.syncViewport(input.id, user.id, {
				center: [input.center.lng, input.center.lat],
				zoom: input.zoom,
				pitch: input.pitch,
				bearing: input.bearing,
			})
		},
	}),
	saveView: t.fieldWithInput({
		type: "Fabric",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: { id: t.input.id() },
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.fabric.saveView(input.id, user.id)
		},
	}),
	updateFabricTitle: t.fieldWithInput({
		type: "Fabric",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: {
			id: t.input.id(),
			title: t.input.string(),
		},
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.fabric.updateTitle(input.id, user.id, input.title)
		},
	}),
	deleteFabric: t.fieldWithInput({
		type: "Fabric",
		errors: { types: [UnauthorizedError, NotFoundError, ForbiddenError] },
		input: { id: t.input.id() },
		resolve: (_parent, { input }, { user, services }) => {
			if (!user) throw new UnauthorizedError()
			return services.fabric.deleteFabric(input.id, user.id)
		},
	}),
}))
