const path = require('path');
const ModifiedDates = require('./modified_dates.js');

const CSV_PATH = `prognozy${path.sep}CSV${path.sep}`;
const PL = 'poland';
const EU = 'europe_long';
const MODIFIED_DATES = 'modified_dates.json';

class Prediction {

    constructor(dirPath) {
        this.dirPath = dirPath;

        const relevantDirPath = dirPath.substr(
            dirPath.lastIndexOf(CSV_PATH) + CSV_PATH.length);

        const split = relevantDirPath.split(path.sep);

        if (split.length != 5) {
            throw 'Invalid prediction path: ' + this.dirPath;
        }

        const plOrEu = split[0];
        this.isPl = plOrEu === PL;
        this.isEu = plOrEu === EU;

        if (!this.isEu && !this.isPl) {
            throw 'Prediction must be either EU or PL. Invalid dir: ' +
                this.dirPath;
        }

        this.year = parseInt(split[1]);
        this.month = parseInt(split[2]);
        this.day = parseInt(split[3]);
        this.hour = parseInt(split[4]);

        if (isNaN(this.year) || isNaN(this.month) || isNaN(this.day) ||
            isNaN(this.hour)) {
            throw 'Cannot parse prediction date from: ' + this.dirPath;
        }

        const modDatePath = path.join(this.dirPath, MODIFIED_DATES);
        this.modDates = new ModifiedDates(modDatePath);
    }
}

module.exports = Prediction;
