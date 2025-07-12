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
		features: r.many.scenarioFeatures({
			from: r.scenarios.id,
			to: r.scenarioFeatures.scenarioId,
		}),
	},
	scenarioFeatures: {
		scenario: r.one.scenarios({
			from: r.scenarioFeatures.scenarioId,
			to: r.scenarios.id,
			optional: false,
		}),
	},
}))
