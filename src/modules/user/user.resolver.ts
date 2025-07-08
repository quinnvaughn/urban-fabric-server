import bcrypt from "bcrypt"
import { builder } from "../../graphql/builder"
import { users } from "./user.model"
import { AuthResponse, LoginInput, RegisterInput } from "./user.type"

builder.mutationFields((t) => ({
	register: t.field({
		type: AuthResponse,
		args: {
			input: t.arg({ type: RegisterInput, required: true }),
		},
		resolve: async (_parent, { input }, { user, db, req }) => {
			// check if user is already registered
			if (user) {
				return {
					__typename: "RegisterError",
					message: "You are already registered.",
				}
			}

			// check if email is already in use
			const existingUser = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, input.email),
			})

			if (existingUser) {
				return {
					__typename: "RegisterError",
					message: "Email is already in use.",
				}
			}

			// generate a hashed password
			const hashedPassword = await bcrypt.hash(input.password, 12)

			// create a new user
			try {
				const [newUser] = await db
					.insert(users)
					.values({
						email: input.email,
						hashed_password: hashedPassword,
						name: input.name,
						role: input.role || "user", // default to 'user' if no role is
					})
					.returning()
				req.session.userId = newUser.id
				return { ...newUser, __typename: "User" }
			} catch {
				return {
					__typename: "RegisterError",
					message: "Failed to register user. Please try again.",
				}
			}
		},
	}),
	login: t.field({
		type: AuthResponse,
		args: {
			input: t.arg({ type: LoginInput, required: true }),
		},
		resolve: async (_parent, { input }, { db, user, req }) => {
			// check if user is already logged in
			if (user) {
				return {
					__typename: "LoginError",
					message: "You are already logged in.",
				}
			}

			// find user by email
			const foundUser = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, input.email),
			})

			if (!foundUser) {
				return {
					__typename: "LoginError",
					message: "Invalid email or password.",
				}
			}

			// verify password
			const isPasswordValid = await bcrypt.compare(
				input.password,
				foundUser.hashed_password,
			)
			if (!isPasswordValid) {
				return {
					__typename: "LoginError",
					message: "Invalid email or password.",
				}
			}

			// return user data
			req.session.userId = foundUser.id
			return { ...foundUser, __typename: "User" }
		},
	}),
	logout: t.field({
		type: "Boolean",
		resolve: async (_parent, _args, { req }) => {
			// Clear the session to log out the user
			req.session.destroy((err) => {
				if (err) {
					console.error("Failed to destroy session:", err)
					return false
				}
			})
			return true
		},
	}),
}))

builder.queryFields((t) => ({
	user: t.field({
		type: "User",
		args: {
			id: t.arg.id({ required: true }),
		},
		resolve: async (_parent, args, { db }) => {
			// Implement the logic to fetch a user by ID
			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, args.id),
			})
			if (!user) {
				throw new Error("User not found")
			}
			return user
		},
	}),
	currentUser: t.field({
		type: "User",
		nullable: true,
		resolve: async (_parent, _args, { user }) => {
			return user
		},
	}),
}))
