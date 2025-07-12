import SchemaBuilder from "@pothos/core"
import ErrorsPlugin from "@pothos/plugin-errors"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import type { User } from "../db/schema"
import type { GraphQLContext } from "./context"

export const builder = new SchemaBuilder<{
	Context: GraphQLContext
	Objects: {
		User: User
	}
}>({
	plugins: [SimpleObjectsPlugin, ErrorsPlugin],
	errors: {
		directResult: true,
	},
})
