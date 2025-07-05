import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { builder } from "./schema"

const server = new ApolloServer({
	schema: builder.toSchema(),
})

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
})

console.log(`🚀 Server ready at ${url}`)
