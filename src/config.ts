import { z } from "zod"

const envSchema = z.object({
	DATABASE_URL: z.url(),
	NODE_ENV: z.enum(["development", "test", "production"]),
	CORS_ORIGIN: z.url().optional(),
	SESSION_SECRET: z.string().min(1, "SESSION_SECRET must be set"),
})

export const envVars = envSchema.parse(process.env)
