const gql = require("apollo-server-express").gql;

const typeDefs = gql`
  type Article {
    title: String
    description: String
    content: String
    tags: [String]
    createdAt: String
    updatedAt: String
  }

  type Pagination {
    page: Int
    size: Int
    totalPages: Int
  }

  type PaginatedArticles {
    data: [Article]
    pagination: Pagination
  }

  type Query {
    articles: PaginatedArticles
  }
`;

module.exports = typeDefs;
