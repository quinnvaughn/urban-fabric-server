import { drizzle } from "drizzle-orm/node-postgres"
import { envVars } from "../config"
import { relations } from "./relations"
import * as schema from "./schema"

export const db = drizzle(envVars.DATABASE_URL, {
	schema: schema,
	relations,
})
