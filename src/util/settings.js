require('dotenv').load();
const AWS = require('aws-sdk');

function getSetting(varName, defaultVal, isBoolean) {
    let setting = process.env[varName];
    if (setting === undefined && defaultVal !== undefined) {
        setting = defaultVal;
    }

    if (isBoolean && typeof setting === 'string') {
        setting = setting !== 'false' && setting !== '0';
    }

    return setting;
}

const settings = Object.freeze({
});

if (settings.LOAD_AWS_CONFIG_FILE) {
    AWS.config.loadFromPath('./.aws-config.json');
}

module.exports = settings;
