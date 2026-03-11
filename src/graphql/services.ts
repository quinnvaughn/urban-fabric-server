import { FabricService } from "../modules/fabric/fabric.service"
import { ProposalService } from "../modules/proposal/proposal.service"
import { UserService } from "../modules/user/user.service"
import type { DbClient } from "../types/db"

export function createServices(db: DbClient) {
	return {
		fabric: new FabricService(db),
		proposal: new ProposalService(db),
		user: new UserService(db),
	}
}

export type Services = ReturnType<typeof createServices>
