const moment = require('moment-timezone');

function dateDiffMinutes(baseMoment, comparedMoment) {
    const duration = moment.duration(comparedMoment.diff(baseMoment));
    return duration.asMinutes();
}

function dateDiffHours(baseMoment, comparedMoment) {
    const duration = moment.duration(comparedMoment.diff(baseMoment));
    return Math.ceil(duration.asHours());
}

module.exports = { dateDiffMinutes, dateDiffHours };
