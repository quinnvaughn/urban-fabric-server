import type { ExpressContextFunctionArgument } from "@as-integrations/express5"
import { db } from "../db"
import type { User } from "../db/schema"
import { createLoaders, type Loaders } from "./loaders"
import { createServices, type Services } from "./services"

export interface GraphQLContext {
	user?: User | null
	db: typeof db
	req: ExpressContextFunctionArgument["req"]
	res: ExpressContextFunctionArgument["res"]
	loaders: Loaders
	services: Services
}

export async function createContext({
	req,
	res,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
	const services = createServices(db)
	const user =
		req.session?.userId != null
			? await services.user.getUserById(req.session.userId)
			: null
	return {
		req,
		loaders: createLoaders(db),
		res,
		user,
		db,
		services,
	}
}
