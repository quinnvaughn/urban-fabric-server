import fs from "node:fs"
import { parse } from "csv-parse/sync"
import { db } from "../src/db"
import { whitelists } from "../src/db/schema"

// read CSV file
const input = fs.readFileSync("scripts/waitlist.csv", "utf8")

type WaitlistRow = {
	Email: string
}

// parse with header row
const records = parse<WaitlistRow>(input, {
	bom: true,
	columns: true,
	skip_empty_lines: true,
})

// insert only the Email field
for (const row of records) {
	if (row.Email) {
		await db
			.insert(whitelists)
			.values({ email: row.Email.trim().toLowerCase() })
			.onConflictDoNothing()
	}
}

console.log(`Inserted ${records.length} records into the whitelist.`)

process.exit(0)
