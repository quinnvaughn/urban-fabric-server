import { builder } from "../../graphql/builder"

builder.objectType("Category", {
	fields: (t) => ({
		id: t.exposeID("id"),
		icon: t.exposeString("icon", { nullable: true }),
		label: t.exposeString("label"),
		order: t.exposeInt("order", { nullable: true }),
		featureOptions: t.field({
			type: ["FeatureOption"],
			resolve: (category, _args, { loaders }) => {
				return loaders.featureOption.byCategoryIds.load(category.id)
			},
		}),
	}),
})
