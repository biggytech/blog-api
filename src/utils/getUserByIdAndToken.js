const User = require('../models/user');

async function getUserByIdAndToken(id, token) {
    const user = await User.findOne({ _id: id, tokens: token });

    return user;
}

module.exports = getUserByIdAndToken;