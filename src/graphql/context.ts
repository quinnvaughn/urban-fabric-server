import type { ExpressContextFunctionArgument } from "@as-integrations/express5"
import { db } from "../db"
import type { User } from "../db/schema"
import * as userSvc from "../modules/user/user.service"

export interface GraphQLContext {
	user?: User | null
	db: typeof db
	req: ExpressContextFunctionArgument["req"]
	res: ExpressContextFunctionArgument["res"]
	services: {
		user: typeof userSvc
	}
}

export async function createContext({
	req,
	res,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, req.session?.userId || ""),
	})
	return {
		req,
		res,
		user,
		db,
		services: {
			user: userSvc,
		},
	}
}
