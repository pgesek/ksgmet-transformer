const fs = require('fs');
const moment = require('moment-timezone');
const settings = require('../util/settings.js');

class ModifiedDates {

    constructor(filePath) {
        this.filePath = filePath;

        this.dates = JSON.parse(fs.readFileSync(
            this.filePath, 'utf8'));
    }

    getFileModDate(file) {
        return moment.tz(this.dates[file], settings.TIMEZONE);
    }
}

module.exports = ModifiedDates;
