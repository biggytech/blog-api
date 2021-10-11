const ApolloServer = require("apollo-server-express").ApolloServer;
const ApolloServerPluginDrainHttpServer =
  require("apollo-server-core").ApolloServerPluginDrainHttpServer;

module.exports = {
  createApolloServer: async (httpServer, app, typeDefs, resolvers) => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    return server;
  },
};
