const fs = require('fs');
const moment = require('moment-timezone');
const settings = require('../util/settings.js');

class ModifiedDates {

    constructor(filePath) {
        this.filePath = filePath;

        this.dates = JSON.parse(fs.readFileSync(
            this.filePath, 'utf8'));
    }

    // TODO: Fix me
    getFileModDate(file) {
        let key = file;
        if (!key) {
            key = Object.keys(this.dates)[0];
        }
        return moment.tz(this.dates[key], settings.TIMEZONE);
    }
}

module.exports = ModifiedDates;
