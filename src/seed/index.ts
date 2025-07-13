import { seedCategories } from "./categories"
import { seedFeatureOptions } from "./feature-options"

async function main() {
	await seedCategories()
	await seedFeatureOptions()
}

main()
	.then(() => {
		console.log("🌱 Seed complete")
		process.exit(0)
	})
	.catch((err) => {
		console.error("❌ Seed failed", err)
		process.exit(1)
	})
