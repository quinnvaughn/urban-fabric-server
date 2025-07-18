import { seedCategories } from "./categories"
import { seedLayerTemplates } from "./layer-templates"

async function main() {
	await seedCategories()
	await seedLayerTemplates()
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
