import { db } from "../db"
import type { FeatureOptionInsert } from "../db/schema"
import { FeatureOptionRepository } from "../modules/feature-option/feature-option.repository"

const DEFAULT_SCENARIO_FEATURE_OPTIONS: FeatureOptionInsert[] = [
	{
		id: "bike_lane",
		label: "Bike Lane",
		description:
			"Adds a bike lane to the road, configurable by type and width.",
		categoryId: "streets",
		geometryType: "LineString",
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
				label: "Connected Feature IDs",
				default: [],
			},
			oneWay: {
				type: "boolean",
				label: "One-Way Lane",
				default: true,
			},
		},
	},
]

export async function seedScenarioFeatureOptions() {
	const repo = new FeatureOptionRepository(db)

	for (const option of DEFAULT_SCENARIO_FEATURE_OPTIONS) {
		await repo.upsert(option)
	}
}
