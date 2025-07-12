import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import { getEnvVars } from "./src/config"

const envVars = getEnvVars()

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: envVars.DATABASE_URL,
	},
})
