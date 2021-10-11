const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    logger.log('Connected to the database.');
})