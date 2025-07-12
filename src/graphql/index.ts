import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"
import "../modules/error/error.type"
import "../modules/canvas/canvas.type"
import "../modules/canvas/canvas.resolver"
import "../modules/scenario/scenario.type"
import { DateTimeResolver } from "graphql-scalars"

builder.queryType({})
builder.mutationType({})
builder.addScalarType("DateTime", DateTimeResolver)

export const schema = builder.toSchema({})
