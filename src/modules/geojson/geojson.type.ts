import { match } from "ts-pattern"
import { builder } from "../../graphql/builder"

export class Geometry {
	type!: string
}

export const GeometryInterface = builder.interfaceType(Geometry, {
	name: "Geometry",
	fields: (t) => ({
		type: t.exposeString("type"),
	}),
	resolveType: (geometry) => {
		return match(geometry.type)
			.with("Point", () => "Point")
			.with("LineString", () => "LineString")
			.with("Polygon", () => "Polygon")
			.with("MultiPoint", () => "MultiPoint")
			.with("MultiLineString", () => "MultiLineString")
			.with("MultiPolygon", () => "MultiPolygon")
			.with("GeometryCollection", () => "GeometryCollection")
			.otherwise(() => "UnknownGeometry")
	},
})

class Point extends Geometry {
	coordinates!: [number, number]
}

builder.objectType(Point, {
	name: "Point",
	interfaces: [GeometryInterface],
	fields: (t) => ({
		type: t.exposeString("type"),
		coordinates: t.field({
			type: ["Float"],
			resolve: (point) => point.coordinates,
		}),
	}),
})

class LineString extends Geometry {
	coordinates!: Array<[number, number]>
}

builder.objectType(LineString, {
	name: "LineString",
	interfaces: [GeometryInterface],
	fields: (t) => ({
		type: t.exposeString("type"),
		coordinates: t.field({
			type: t.listRef(t.listRef("Float", { nullable: false }), {
				nullable: false,
			}),
			resolve: (ls) => ls.coordinates,
		}),
	}),
})

class Polygon extends Geometry {
	coordinates!: Array<Array<[number, number]>>
}

builder.objectType(Polygon, {
	name: "Polygon",
	interfaces: [GeometryInterface],
	fields: (t) => ({
		type: t.exposeString("type"),
		coordinates: t.field({
			type: t.listRef(
				t.listRef(t.listRef("Float", { nullable: false }), { nullable: false }),
				{ nullable: false },
			),
			resolve: (pg) => pg.coordinates,
		}),
	}),
})
