import type { DbClient } from "../../types/db"

export class WhitelistRepository {
	constructor(readonly client: DbClient) {}

	async isEmailWhitelisted(email: string): Promise<boolean> {
		const record = await this.client.query.whitelists.findFirst({
			where: { email: email.toLowerCase().trim() },
		})
		return !!record
	}
}
