import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"
import "../modules/error/error.type"
import "../modules/simulation/simulation.type"
import "../modules/simulation/simulation.resolver"
import "../modules/scenario/scenario.type"
import "../modules/scenario/scenario.resolver"
import "../modules/layer-instance/layer-instance.type"
import "../modules/layer-instance/layer-instance.resolver"
import "../modules/layer-template/layer-template.type"
import "../modules/layer-template/layer-template.resolver"
import "../modules/category/category.type"
import "../modules/category/category.resolver"
import "../modules/simulation-state/simulation-state.type"
import "../modules/simulation-state/simulation-state.resolver"
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
