import "dotenv/config"
import http from "node:http"
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@as-integrations/express5"
import pgSession from "connect-pg-simple"
import cors from "cors"
import express from "express"
import session from "express-session"
import { Pool } from "pg"
import { envVars } from "./config"
import { schema } from "./graphql"
import { createContext, type GraphQLContext } from "./graphql/context"

const app = express()

const httpServer = http.createServer(app)

const PgSession = pgSession(session)

const pgPool = new Pool({ connectionString: envVars.DATABASE_URL })

const server = new ApolloServer<GraphQLContext>({
	schema,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
	session({
		store: new PgSession({
			pool: pgPool,
			tableName: "sessions",
		}),
		secret: envVars.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			sameSite: "lax",
			httpOnly: true,
			secure: envVars.NODE_ENV === "production",
		},
	}),
)

app.use(
	"/",
	cors<cors.CorsRequest>({
		origin: envVars.CORS_ORIGIN,
		credentials: true, // Allow credentials (cookies, authorization headers, etc.)
	}),
	// 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
	express.json({ limit: "50mb" }),
	// expressMiddleware accepts the same arguments:
	// an Apollo Server instance and optional configuration options
	expressMiddleware(server, {
		context: createContext,
	}),
)

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
console.log(`🚀 Server ready at http://localhost:4000/`)
