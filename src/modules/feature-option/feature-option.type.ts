import { builder } from "../../graphql/builder"
import { geometryTypes } from "./geometry-type.model"

export const GeometryType = builder.enumType("GeometryType", {
	values: geometryTypes,
})

builder.objectType("FeatureOption", {
	fields: (t) => ({
		id: t.exposeID("id"),
		label: t.exposeString("label"),
		description: t.exposeString("description", { nullable: true }),
		geometryType: t.field({
			type: GeometryType,
			resolve: (featureOption) => featureOption.geometryType,
		}),
		propertiesSchema: t.field({
			type: "JSON",
			// biome-ignore lint/suspicious/noExplicitAny: We need to allow any here for flexibility
			resolve: (featureOption) => featureOption.propertiesSchema as any,
		}),
	}),
})
