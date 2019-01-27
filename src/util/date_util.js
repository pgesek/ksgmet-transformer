const moment = require('moment-timezone');
const settings = require('./settings.js');

const DIR_FORMAT = 'YYYY_MM_DD_hh_mm_ss'

function parseDirDate(dirName) {
    return moment.tz(dirName, DIR_FORMAT, settings.TIMEZONE)
}

function formatTarName(momentDate, predictionType) {
    const tarFormat = `[${predictionType.TAR_PREFIX}]_YYYY_MM_DD[.tar.gz]`;
    return momentDate.format(tarFormat);
}

module.exports = {
    parseDirDate,
    formatTarName
};
