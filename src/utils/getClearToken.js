function getClearToken(token) {
    return token.replace('Bearer ', '');
}

module.exports = getClearToken;