import bcrypt from "bcrypt"
import type { DbClient } from "../../types/db"
import { UserRepository } from "./user.repository"
import { UserError, UserService } from "./user.service"

describe("User Service", () => {
	let svc: UserService

	beforeEach(() => {
		// Restore any previous spies
		vi.restoreAllMocks()

		// Stub the repository methods on the prototype
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue(
			undefined,
		)
		vi.spyOn(UserRepository.prototype, "createUser").mockResolvedValue({
			id: "u1",
			email: "a@b",
			name: "A",
			role: "user",
		} as any)

		// Stub bcrypt.hash
		vi.spyOn(bcrypt, "hash").mockImplementation(() =>
			Promise.resolve("hashedpw"),
		)

		// Now when UserService ctor does `new UserRepository(...)`, those methods are mocked
		const fakeDb = { transaction: (cb: any) => cb(fakeDb) } as DbClient
		svc = new UserService(fakeDb)
	})

	it("registerUser -> hashes & creates when email not found", async () => {
		const out = await svc.registerUser({
			email: " Foo@Bar.COM ",
			name: "Foo",
			password: "secret",
		})

		expect(UserRepository.prototype.findUserByEmail).toHaveBeenCalledWith(
			" Foo@Bar.COM ",
		)
		expect(bcrypt.hash).toHaveBeenCalledWith("secret", 12)
		expect(UserRepository.prototype.createUser).toHaveBeenCalledWith({
			email: "foo@bar.com",
			name: "Foo",
			hashedPassword: "hashedpw",
			role: "user",
		})

		expect(out).toEqual({ id: "u1", email: "a@b", name: "A", role: "user" })
	})
	it("registerUser → throws if email already in use", async () => {
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue({
			id: "exists",
		} as any)

		await expect(
			svc.registerUser({ email: "x@x", name: "X", password: "p" }),
		).rejects.toThrow(UserError)
	})
})
