import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import { envVars } from "./src/config"

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: envVars.DATABASE_URL,
	},
})
