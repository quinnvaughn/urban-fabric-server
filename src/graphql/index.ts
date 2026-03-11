import { builder } from "./builder"
import "../modules/error/error.type"
import "../modules/fabric/fabric.type"
import "../modules/proposal/proposal.type"
import "../modules/user/user.type"
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
