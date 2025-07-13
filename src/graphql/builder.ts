import SchemaBuilder from "@pothos/core"
import ErrorsPlugin from "@pothos/plugin-errors"
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects"
import WithInputPlugin from "@pothos/plugin-with-input"
import type * as GEOJSON from "geojson"
import type { Canvas, Feature, Scenario, User } from "../db/schema"
import type { FeatureOption } from "../modules/feature-option/feature-option.model"
import type { GeometryType } from "../modules/feature-option/geometry-type.model"
import type { GraphQLContext } from "./context"

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const builder = new SchemaBuilder<{
	DefaultFieldNullability: false
	DefaultInputFieldRequiredness: true
	Context: GraphQLContext
	Scalars: {
		DateTime: {
			Input: Date
			Output: Date
		}
		GeoJSON: {
			Input: GEOJSON.Geometry
			Output: GEOJSON.Geometry
		}
		JSON: {
			Input: Record<string, unknown>
			Output: Record<string, unknown>
		}
	}
	Objects: {
		User: User
		Canvas: Canvas
		Scenario: Scenario
		FeatureOption: FeatureOption
	}
	Interfaces: {
		Feature: Feature
	}
}>({
	defaultInputFieldRequiredness: true,
	defaultFieldNullability: false,
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
