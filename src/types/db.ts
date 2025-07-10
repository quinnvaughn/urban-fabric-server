import type { db } from "../db"

type TransactionClient = (typeof db)["transaction"] extends <T>(
	fn: (tx: infer C) => Promise<T>,
) => Promise<T>
	? C
	: never

export type DbClient = typeof db | TransactionClient
