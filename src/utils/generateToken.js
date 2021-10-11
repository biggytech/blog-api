const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_PRIVATE, {
        expiresIn: '1d'
    });
    return token;
}

module.exports = generateToken;