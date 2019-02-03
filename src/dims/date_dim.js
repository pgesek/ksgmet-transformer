const moment = require('moment-timezone');
const settings = require('../util/settings.js');

const START_DATE = moment.tz('2018-09-01', settings.TIMEZONE);

function calcDateDimId(momentDate) {
    const duration = moment.duration(momentDate.diff(START_DATE));
    
    let dayDiff = duration.asDays();
    dayDiff = Math.floor(dayDiff) + 1;

    if (dayDiff <= 0) {
        throw 'Date is too old: ' + momentDate.format();
    }

    return dayDiff;
}

module.exports = calcDateDimId;
