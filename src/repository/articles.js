const Article = require("../models/article");

module.exports = {
  getAll: async (_page, _size) => {
    const page = Math.max(1, _page || 1); // page numbering starts from 1
    const size = parseInt(_size) || 10;
    const articles = await Article.find()
      .limit(size)
      .skip(size * (page - 1))
      .select("title description tags createdAt updatedAt");
    const totalCount = await Article.estimatedDocumentCount();
    return {
      data: articles,
      pagination: {
        page,
        size,
        totalPages: Math.ceil(totalCount / size),
      },
    };
  },

  getById: async (id) => {
    const article = await Article.findById(id);

    if (!article) {
      return null;
    }

    return article;
  },
};
