import bcrypt from "bcrypt"
import type { DbClient } from "../../types/db"
import { UnauthorizedError, ValidationError } from "../error"
import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

describe("User Service", () => {
	let svc: UserService

	beforeEach(() => {
		// Restore any previous spies
		vi.restoreAllMocks()

		// Now when UserService ctor does `new UserRepository(...)`, those methods are mocked
		const fakeDb = { transaction: (cb: any) => cb(fakeDb) } as DbClient
		svc = new UserService(fakeDb)
	})

	it("registerUser -> hashes & creates when email not found", async () => {
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue(
			undefined,
		)
		vi.spyOn(UserRepository.prototype, "createUser").mockResolvedValue({
			id: "u1",
			email: "a@b",
			name: "A",
			role: "user",
		} as any)
		vi.spyOn(bcrypt, "hash").mockImplementation(() =>
			Promise.resolve("hashedpw"),
		)
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
		).rejects.toThrow(ValidationError)
	})
	it("loginUser -> finds by email, compares password", async () => {
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue({
			id: "u1",
			email: "a@b",
			name: "A",
			hashedPassword: "hashedpw",
		} as any)

		vi.spyOn(bcrypt, "compare").mockImplementation(() => true)

		const out = await svc.loginUser({ email: "a@b", password: "secret" })

		expect(UserRepository.prototype.findUserByEmail).toHaveBeenCalledWith("a@b")
		expect(bcrypt.compare).toHaveBeenCalledWith("secret", "hashedpw")

		expect(out).toEqual({
			id: "u1",
			email: "a@b",
			name: "A",
			hashedPassword: "hashedpw",
		})
	})
	it("loginUser → throws if email not found", async () => {
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue(
			undefined,
		)

		await expect(
			svc.loginUser({ email: "x@x", password: "p" }),
		).rejects.toThrow(UnauthorizedError)
	})
	it("loginUser → throws if password does not match", async () => {
		vi.spyOn(UserRepository.prototype, "findUserByEmail").mockResolvedValue({
			id: "u1",
			email: "a@b",
			name: "A",
			hashedPassword: "hashedpw",
		} as any)

		vi.spyOn(bcrypt, "compare").mockImplementation(() => false)

		await expect(
			svc.loginUser({ email: "a@b", password: "wrong" }),
		).rejects.toThrow(UnauthorizedError)
	})
	it("getUserById → finds by id", async () => {
		vi.spyOn(UserRepository.prototype, "findUserById").mockResolvedValue({
			id: "u1",
			email: "a@b",
			name: "A",
			role: "user",
		} as any)
		const out = await svc.getUserById("u1")
		expect(UserRepository.prototype.findUserById).toHaveBeenCalledWith("u1")
		expect(out).toEqual({ id: "u1", email: "a@b", name: "A", role: "user" })
	})
	it("getUserById → throws if not found", async () => {
		vi.spyOn(UserRepository.prototype, "findUserById").mockResolvedValue(
			undefined,
		)

		await expect(svc.getUserById("u1")).rejects.toThrow("User not found")
	})
})
