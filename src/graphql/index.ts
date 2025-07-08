import { builder } from "./builder"
import "../modules/user/user.type"
import "../modules/user/user.resolver"

builder.queryType({})

builder.mutationType({})

export const schema = builder.toSchema({})
