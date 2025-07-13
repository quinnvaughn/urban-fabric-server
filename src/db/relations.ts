import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
	users: {
		canvases: r.many.canvases({
			from: r.users.id,
			to: r.canvases.userId,
		}),
	},
	canvases: {
		author: r.one.users({
			from: r.canvases.userId,
			to: r.users.id,
			optional: false,
		}),
		scenarios: r.many.scenarios({
			from: r.canvases.id,
			to: r.scenarios.canvasId,
		}),
	},
	scenarios: {
		canvas: r.one.canvases({
			from: r.scenarios.canvasId,
			to: r.canvases.id,
			optional: false,
		}),
		features: r.many.features({
			from: r.scenarios.id,
			to: r.features.scenarioId,
		}),
	},
	features: {
		scenario: r.one.scenarios({
			from: r.features.scenarioId,
			to: r.scenarios.id,
			optional: false,
		}),
		option: r.one.featureOptions({
			from: r.features.optionId,
			to: r.featureOptions.id,
			optional: true,
		}),
	},
	featureOptions: {
		category: r.one.categories({
			from: r.featureOptions.categoryId,
			to: r.categories.id,
			optional: true,
		}),
		features: r.many.features({
			from: r.featureOptions.id,
			to: r.features.optionId,
		}),
	},
	categories: {
		featureOptions: r.many.featureOptions({
			from: r.categories.id,
			to: r.featureOptions.categoryId,
		}),
	},
}))
