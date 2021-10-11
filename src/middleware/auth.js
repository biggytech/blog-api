const verifyTokenAndUser = require('../utils/verifyTokenAndUser');
const getClearToken = require('../utils/getClearToken');

async function auth(req, res, next) {
    let token = req.headers?.authorization || '';
    const clearedToken = getClearToken(token);

    try {
        let { user } = await verifyTokenAndUser(clearedToken);

        req.user = user;
        req.token = clearedToken;

        next();
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).send({ error: { message: 'Unauthorized', type: 'TokenExpiredError' } });
        } else {
            res.status(401).send({ error: { message: 'Unauthorized' } });
        }        
    }

};

module.exports = auth;