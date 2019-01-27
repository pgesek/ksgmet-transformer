const moment = require('moment-timezone');

function dateDiff(baseMoment, comparedMoment) {
    const duration = moment.duration(comparedMoment.diff(baseMoment));
    return duration.asMinutes();
}

module.exports = dateDiff;
