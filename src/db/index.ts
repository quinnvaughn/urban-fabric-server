import { drizzle } from "drizzle-orm/node-postgres"
import { configEnv } from "../config"
import { relations } from "./relations"
import * as schema from "./schema"

export const db = drizzle(configEnv.DATABASE_URL, {
	schema: schema,
	relations,
})
