import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"
import "../modules/error/error.type"
import "../modules/canvas/canvas.type"
import "../modules/canvas/canvas.resolver"
import "../modules/scenario/scenario.type"
import "../modules/scenario/scenario.resolver"
import "../modules/feature/feature.type"
import "../modules/feature/feature.resolver"
import "../modules/feature-option/feature-option.type"
import "../modules/feature-option/feature-option.resolver"
import "../modules/category/category.type"
import "../modules/category/category.resolver"
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
