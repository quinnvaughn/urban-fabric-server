import { z } from "zod"

const envSchema = z.object({
	DATABASE_URL: z.url(),
	NODE_ENV: z.enum(["development", "test", "production"]),
})

export const configEnv = envSchema.parse(process.env)
