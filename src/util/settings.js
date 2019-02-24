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
    S3_BUCKET_NAME: getSetting('S3_BUCKET_NAME', 'ksgmet'),
    
    LOAD_AWS_CONFIG_FILE: getSetting('LOAD_AWS_CONFIG_FILE', false, true),
    UPLOAD_TO_S3: getSetting('UPLOAD_TO_S3', 'true', true),

    TIMEZONE: getSetting('TIMEZONE', 'Europe/Warsaw'),
    PRED_MAX_MINUTES_DIFF: parseInt(getSetting('PRED_MAX_MINUTES_DIFF', '300')),
    ACTUAL_MAX_MINUTES_DIFF: parseInt(getSetting('ACTUAL_MAX_MINUTES_DIFF', '240')),

    TARGET_BUCKET: getSettings('S3_TARGET_BUCKET_NAME', 'ksgmet-processed'),
    TARGET_PREFIX: getSettings('S3_TARGET_PREFIX', 'csv'),
});

if (settings.LOAD_AWS_CONFIG_FILE) {
    AWS.config.loadFromPath('./.aws-config.json');
}

module.exports = settings;
