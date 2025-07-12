import { drizzle } from "drizzle-orm/node-postgres"
import { getEnvVars } from "../config"
import { relations } from "./relations"
import * as schema from "./schema"

const envVars = getEnvVars()

export const db = drizzle(envVars.DATABASE_URL, {
	schema: schema,
	relations,
})
