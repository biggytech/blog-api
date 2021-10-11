const jwt = require('jsonwebtoken');

const getUserByIdAndToken = require('./getUserByIdAndToken');

async function verifyTokenAndUser(token) {
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_PRIVATE);

        const user = await getUserByIdAndToken(decodedToken._id, token);
        if (!user) {
            throw new Error();
        }

        return { user, token };
    } catch(err) {
        throw err;       
    }

};

module.exports = verifyTokenAndUser;