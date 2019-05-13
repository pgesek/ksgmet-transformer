const moment = require('moment-timezone');
const settings = require('../util/settings');


class PredictionV2 {

    constructor(dirPath, predDate, predLength, predType) {
        this.dirPath = dirPath;
        this.predLength = predLength;
        this.predDate = predDate;
        this.predType = predType;
    }

    getPredictionDate() {
        const format = 'YYYY_MM_DD_HH';
        return moment(this.predDate, format).tz(settings.TIMEZONE);
    }
}

module.exports = PredictionV2;
