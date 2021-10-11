const articles = require("../repository/articles");

const resolvers = {
  Query: {
    articles: async () => {
      return await articles.getAll();
    },
  },
};

module.exports = resolvers;
