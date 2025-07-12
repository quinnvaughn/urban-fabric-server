import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"
import "../modules/error/error.type"
import "../modules/canvas/canvas.type"
import "../modules/canvas/canvas.resolver"
import "../modules/scenario/scenario.type"
import "../modules/scenario/scenario.resolver"
import "../modules/scenario-feature/scenario-feature.type"
import "../modules/scenario-feature/scenario-feature.resolver"
import "../modules/geojson/geojson.type"
import {
	DateTimeResolver,
	GeoJSONResolver,
	JSONResolver,
} from "graphql-scalars"

builder.queryType({})
builder.mutationType({})
builder.addScalarType("DateTime", DateTimeResolver)
builder.addScalarType("GeoJSON", GeoJSONResolver)
builder.addScalarType("JSON", JSONResolver)

export const schema = builder.toSchema({})
