import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { baseFields } from "../../db/fields"

export const users = pgTable("users", {
	...baseFields,
	email: varchar("email", { length: 255 }).notNull().unique(),
	hashed_password: varchar("hashed_password", { length: 255 }).notNull(),
	name: varchar("name", { length: 100 }),
	role: varchar("role", { length: 50 }).default("user").notNull(),
})

export const sessions = pgTable("sessions", {
	sid: varchar("sid", { length: 255 }).primaryKey(),
	sess: json("sess").notNull(),
	expire: timestamp("expire", { mode: "date" }).notNull(),
})

export type User = InferSelectModel<typeof users>
// or for insert type (without required defaults):
export type NewUser = InferInsertModel<typeof users>
