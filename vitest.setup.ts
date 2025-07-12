import dotenv from "dotenv"
import { envVars } from "./src/config"

dotenv.config({ path: ".env.test" })

if (!envVars.DATABASE_URL.includes("_test")) {
	throw new Error("Tests must use a test database!")
}
