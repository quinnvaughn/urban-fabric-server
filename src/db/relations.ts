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
		layerInstances: r.many.layerInstances({
			from: r.scenarios.id,
			to: r.layerInstances.scenarioId,
		}),
	},
	layerInstances: {
		scenario: r.one.scenarios({
			from: r.layerInstances.scenarioId,
			to: r.scenarios.id,
			optional: false,
		}),
		option: r.one.layerTemplates({
			from: r.layerInstances.templateId,
			to: r.layerTemplates.id,
			optional: true,
		}),
	},
	layerTemplates: {
		category: r.one.categories({
			from: r.layerTemplates.categoryId,
			to: r.categories.id,
			optional: true,
		}),
		layerInstances: r.many.layerInstances({
			from: r.layerTemplates.id,
			to: r.layerInstances.templateId,
		}),
	},
	categories: {
		layerTemplates: r.many.layerTemplates({
			from: r.categories.id,
			to: r.layerTemplates.categoryId,
		}),
	},
}))
