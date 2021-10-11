const express = require("express");
require("./db/mongoose");
const { users, articles } = require("./routes");
const logger = require("./utils/logger");
const cors = require("cors");
const path = require("path");
const http = require("http");
const createApolloServer = require("./apolloServer").createApolloServer;
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();
const port = process.env.PORT;
const isDev = !!+process.env.IS_DEV;

if (isDev) {
  app.use(cors());
}

app.use(express.json());
app.use("/users", users);
app.use("/articles", articles);
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./docs/index.html"));
});

const books = [
  {
    title: "The Awakening 2",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const httpServer = http.createServer(app);
createApolloServer(httpServer, app, typeDefs, resolvers)
  .then((apolloServer) => {
    return new Promise((resolve) =>
      httpServer.listen({ port }, () => resolve(apolloServer))
    );
  })
  .then((apolloServer) => {
    logger.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    logger.log(`Server is listening on port ${port}`);
  });
