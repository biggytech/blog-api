const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // every string is unique
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

articleSchema.methods.toJSON = function() {
    const article = this;
    const articleObject = article.toObject();

    articleObject.id = articleObject._id;
    delete articleObject._id;

    return articleObject;
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;