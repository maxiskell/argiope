import "reflect-metadata";

import { resolve } from "path";

import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { ApolloServer, ServerInfo } from "apollo-server";

import VersionResolver from "./versioning/version.resolver";

class App {
  resolvers: [Function, ...Function[]] = [VersionResolver];

  constructor(readonly port: number) {}

  async start(): Promise<{ server: ApolloServer; serverInfo: ServerInfo }> {
    const schema: GraphQLSchema = await this.generateSchema();

    const server: ApolloServer = new ApolloServer({ schema });
    const serverInfo: ServerInfo = await server.listen(this.port);

    return { server, serverInfo };
  }

  async generateSchema(): Promise<GraphQLSchema> {
    return buildSchema({
      resolvers: this.resolvers,
      emitSchemaFile: resolve(__dirname, "schema.graphql"),
    });
  }
}

export default App;
