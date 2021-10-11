const chalk = require('chalk');

const logger = {

    log(message) {
        let timestamp = new Date().toISOString();
        console.log(`${chalk.bgGreen(`[LOG][${timestamp}]`)} ${message}`);
    },

    error(message) {
        let timestamp = new Date().toISOString();
        console.log(`${chalk.bgRed(`[ERROR][${timestamp}]`)} ${message}`);
    }

};

module.exports = logger;