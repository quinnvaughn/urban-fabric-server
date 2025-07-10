import type { ExpressContextFunctionArgument } from "@as-integrations/express5"
import { db } from "../db"
import type { User } from "../db/schema"
import { UserService } from "../modules/user/user.service"

export interface GraphQLContext {
	user?: User | null
	db: typeof db
	req: ExpressContextFunctionArgument["req"]
	res: ExpressContextFunctionArgument["res"]
	services: {
		user: UserService
	}
}

const userService = new UserService(db)

export async function createContext({
	req,
	res,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
	const user =
		req.session?.userId != null
			? await userService.getUserById(req.session.userId)
			: null
	return {
		req,
		res,
		user,
		db,
		services: {
			user: userService,
		},
	}
}
