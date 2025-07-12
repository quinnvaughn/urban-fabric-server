import SchemaBuilder from "@pothos/core"
import ErrorsPlugin from "@pothos/plugin-errors"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import WithInputPlugin from "@pothos/plugin-with-input"
import type { Canvas, Scenario, User } from "../db/schema"
import type { GraphQLContext } from "./context"

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const builder = new SchemaBuilder<{
	Context: GraphQLContext
	Scalars: {
		DateTime: {
			Input: Date
			Output: Date
		}
	}
	Objects: {
		User: User
		Canvas: Canvas
		Scenario: Scenario
	}
}>({
	plugins: [SimpleObjectsPlugin, WithInputPlugin, ErrorsPlugin],
	errors: {
		directResult: true,
	},
	withInput: {
		typeOptions: {
			name: ({ fieldName }) => {
				return `${capitalize(fieldName)}Input`
			},
		},
		argOptions: {
			required: true,
		},
	},
})
