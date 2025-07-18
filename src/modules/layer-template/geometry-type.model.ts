import { pgEnum } from "drizzle-orm/pg-core"

export const geometryTypes = [
	"Point",
	"LineString",
	"Polygon",
	"MultiPoint",
	"MultiLineString",
	"MultiPolygon",
] as const

export type GeometryType = (typeof geometryTypes)[number]

export const geometryTypeEnum = pgEnum("geometry_type", geometryTypes)
