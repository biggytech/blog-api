const express = require("express");

const Article = require("../models/article");
const auth = require("../middleware/auth");
const checkPermission = require("./utils/check-permission");
const logger = require("../utils/logger");
const PERMISSIONS = require("../constants/permissions");
const articles = require("../repository/articles");

const articlesRouter = express.Router();

// create article
articlesRouter.post("/", auth, async (req, res) => {
  if (!checkPermission(req.user, PERMISSIONS.WRITE)) {
    return res
      .status(403)
      .send({ error: { message: "Not enough permissions for this action" } });
  }

  const { title, description, content, tags } = req.body;

  try {
    const article = new Article({
      title,
      description,
      content,
      tags,
    });
    await article.save();
    res.send(article);
  } catch (err) {
    logger.error(err.message);
    res.status(400).send({ error: { message: "Invalid article data" } });
  }
});

// edit article
articlesRouter.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, content, tags } = req.body;

    if (!id) {
      return res.status(400).send({ error: { message: "Provide id value" } });
    }

    const article = await Article.findByIdAndUpdate(id, {
      title,
      description,
      content,
      tags,
    });

    if (!article) {
      return res.status(404).send();
    }

    res.send(article);
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

// get articles
articlesRouter.get("/", async (req, res) => {
  try {
    res.send(await articles.getAll(req.query.page, req.query.size));
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

// get an article
articlesRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ error: { message: "Provide id value" } });
    }

    const article = await articles.getById(id);

    if (!article) {
      return res.status(404).send();
    }

    res.send(article);
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

// delete article
articlesRouter.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ error: { message: "Provide id value" } });
    }

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).send();
    }

    res.send(article);
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

module.exports = articlesRouter;
