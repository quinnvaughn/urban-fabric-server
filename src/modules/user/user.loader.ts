import DataLoader from "dataloader"
import type { UserRepository } from "./user.repository"

export function createUserLoader(repo: UserRepository) {
	return new DataLoader<
		string,
		Awaited<ReturnType<typeof repo.findUserById>> | null
	>(async (ids) => {
		const users = await repo.findManyUsersByIds([...ids])
		const map = new Map(users.map((u) => [u.id, u]))
		return ids.map((id) => map.get(id) ?? null)
	})
}
