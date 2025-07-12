import DataLoader from "dataloader"
import type { Canvas } from "./canvas.model"
import type { CanvasRepository } from "./canvas.repository"

function createCanvasLoader(repo: CanvasRepository) {
	return new DataLoader<
		string,
		Awaited<ReturnType<typeof repo.findById>> | null
	>(async (ids: readonly string[]) => {
		const rows = await repo.findManyByIds([...ids])
		const canvasMap = new Map(rows.map((canvas) => [canvas.id, canvas]))
		return ids.map((id) => canvasMap.get(id) || null)
	})
}

function createCanvasLoaderByUserIdLoader(repo: CanvasRepository) {
	return new DataLoader<string, Canvas[]>(async (userIds) => {
		const rows = await repo.findManyByUserIds([...userIds])
		const grouped = new Map<string, Canvas[]>()

		for (const row of rows) {
			if (!grouped.has(row.userId)) {
				grouped.set(row.userId, [])
			}
			grouped.get(row.userId)?.push(row)
		}

		return userIds.map((id) => grouped.get(id) ?? [])
	})
}

export const canvasLoaders = (repo: CanvasRepository) => ({
	byId: createCanvasLoader(repo),
	byUserId: createCanvasLoaderByUserIdLoader(repo),
})
