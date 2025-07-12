import { z } from "zod"

const isTest = process.env.NODE_ENV === "test"

const envSchema = z.object({
	DATABASE_URL: z.url(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	CORS_ORIGIN: z.url().optional(),
	SESSION_SECRET: z
		.string()
		.min(1, "SESSION_SECRET must be set")
		.default(isTest ? "test-secret" : "keyboard cat"),
})

export function getEnvVars() {
	return envSchema.parse(process.env)
}
