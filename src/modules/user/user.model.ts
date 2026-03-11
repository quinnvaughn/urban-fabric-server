import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"

export const users = pgTable("users", {
	...baseFields,
	email: text("email").notNull().unique(),
	hashedPassword: text("hashed_password").notNull(),
	name: text("name").notNull(),
	role: text("role").default("user").notNull(),
})

export const sessions = pgTable("sessions", {
	sid: text("sid").primaryKey(),
	sess: json("sess").notNull(),
	expire: timestamp("expire", { mode: "date" }).notNull(),
})

export type User = InferSelectModel<typeof users>
// or for insert type (without required defaults):
export type UserInsert = InferInsertModel<typeof users>
