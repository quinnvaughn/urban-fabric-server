import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
	users: {
		simulations: r.many.simulations({
			from: r.users.id,
			to: r.simulations.userId,
		}),
	},
	simulations: {
		author: r.one.users({
			from: r.simulations.userId,
			to: r.users.id,
			optional: false,
		}),
		scenarios: r.many.scenarios({
			from: r.simulations.id,
			to: r.scenarios.simulationId,
		}),
	},
	scenarios: {
		simulation: r.one.simulations({
			from: r.scenarios.simulationId,
			to: r.simulations.id,
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
