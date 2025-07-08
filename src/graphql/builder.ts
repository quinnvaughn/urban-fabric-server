import SchemaBuilder from "@pothos/core"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import type { User } from "../db/schema"
import type { GraphQLContext } from "./context"

export const builder = new SchemaBuilder<{
	Context: GraphQLContext
	Objects: {
		User: User
	}
}>({
	plugins: [SimpleObjectsPlugin],
})
