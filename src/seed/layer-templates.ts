import { db } from "../db"
import type { LayerTemplateInsert } from "../db/schema"
import { LayerTemplateRepository } from "../modules/layer-template/layer-template.repository"

const DEFAULT_SCENARIO_LAYER_TEMPLATES: LayerTemplateInsert[] = [
	{
		id: "bike_lane",
		label: "Bike Lane",
		description:
			"Adds a bike lane to the road, configurable by type and width.",
		categoryId: "streets",
		geometryType: "LineString",
		icon: "Bicycle",
		propertiesSchema: {
			type: {
				type: "enum",
				label: "Lane Type",
				options: ["painted", "buffered", "protected"],
				default: "protected",
			},
			width: {
				type: "number",
				label: "Width (m)",
				default: 1.8,
				min: 1.0,
				max: 3.0,
				step: 0.1,
			},
			buffer: {
				type: "enum",
				label: "Buffer Type",
				default: "none",
				options: ["none", "striped", "planter", "curb", "bollard"],
			},
			curbSide: {
				type: "boolean",
				label: "Next to Curb",
				default: true,
			},
			parkingAdjacent: {
				type: "boolean",
				label: "Next to Parking",
				default: false,
			},
			gradeSeparated: {
				type: "boolean",
				label: "Physically Separated (Grade)",
				default: false,
			},
			connectsTo: {
				type: "string",
				list: true,
				label: "Connected LayerInstance IDs",
				default: [],
			},
			oneWay: {
				type: "boolean",
				label: "One-Way Lane",
				default: true,
			},
		},
		interactionConfig: {
			toolType: "draw",
			defaultCursor: "crosshair",
			validCursor: "pointer",
			invalidCursor: "not-allowed",
			validTargetLayers: ["road-centerline"],
			hoverStyle: {
				"line-color": "#0af",
				"line-width": 4,
			},
			activeStyle: {
				"line-color": "#07a",
				"line-width": 6,
			},
		},
	},
]

export async function seedLayerTemplates() {
	const repo = new LayerTemplateRepository(db)

	for (const option of DEFAULT_SCENARIO_LAYER_TEMPLATES) {
		await repo.upsert(option)
	}
	console.log("✅ Seeded scenario layer templates")
}
