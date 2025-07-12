import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"
import "../modules/error/error.type"

builder.queryType({})

builder.mutationType({})

export const schema = builder.toSchema({})
