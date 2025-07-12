import dotenv from "dotenv"

dotenv.config({ path: ".env.test" })

if (!process.env.DATABASE_URL?.includes("_test")) {
	throw new Error("Tests must use a test database!")
}
