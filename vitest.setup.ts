import dotenv from "dotenv"
import { getEnvVars } from "./src/config"

dotenv.config({ path: ".env.test" })

const envVars = getEnvVars()

if (!envVars.DATABASE_URL.includes("_test")) {
	throw new Error("Tests must use a test database!")
}
