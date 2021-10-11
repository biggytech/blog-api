const jwt = require('jsonwebtoken');

function getTokenPayload(token) {
    return jwt.decode(token);
}

module.exports = getTokenPayload;