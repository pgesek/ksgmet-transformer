const path = require('path');
const fs = require('fs');
const ModifiedDates = require('./modified_dates.js');
const moment = require('moment-timezone');
const settings = require('../util/settings.js');
const PredictionType = require('../util/prediction_type.js');
const formatPredictionDirPrefix = require('../util/date_util').formatPredictionDirPrefix;
const formatPredictionDateToSortedPath = require('../util/date_util').formatPredictionDateToSortedPath;
const dateDiffHours = require('../util/date_diff').dateDiffHours;
const dateDiffMinutes = require('../util/date_diff').dateDiffMinutes;


const CSV_PATH = `prognozy${path.sep}CSV${path.sep}`;
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
        this.predictionType = PredictionType.fromString(plOrEu);

        this.year = parseInt(split[1]);
        this.month = parseInt(split[2]);
        this.day = parseInt(split[3]);
        this.hour = parseInt(split[4]);

        if (isNaN(this.year) || isNaN(this.month) || isNaN(this.day) ||
            isNaN(this.hour)) {
            throw 'Cannot parse prediction date from: ' + this.dirPath;
        }
    }

    getPredictionDate() {
        const arr = [this.year, this.month - 1, this.day, this.hour];
        return moment.tz(arr, settings.TIMEZONE);
    }

    getModDates() {
        const modDatePath = path.join(this.dirPath, MODIFIED_DATES);
        return new ModifiedDates(modDatePath);
    }

    getModDate(fileName) {
        return this.getModDates().getFileModDate(fileName);
    }

    getMadeOnDate() {
        return this.getModDates().getFileModDate();
    }

    getMinuteDiff() {
        let diff = dateDiffMinutes(this.getPredictionDate(), this.getMadeOnDate());
        return Math.abs(diff);
    }

    toPath() {
        return formatPredictionDirPrefix(this.getPredictionDate(),
            this.predictionType);
    }

    toString() {
        return `Prediction for ${this.getPredictionDate().format()}`
            + ` made on ${this.getMadeOnDate()}`;
    }

    isFuturePrediction() {
        const diff = dateDiffHours(this.getMadeOnDate(),
            this.getPredictionDate());
        return diff > 0;            
    }

    getPathInSortedBucket() {
        const diff = dateDiffHours(this.getMadeOnDate(),
            this.getPredictionDate());
        return formatPredictionDateToSortedPath(
            this.getPredictionDate(), diff); 
    }

    listCsvFiles() {
        let allFiles = fs.readdirSync(this.dirPath);
        return allFiles.filter(file => file.endsWith('.csv'));
    }
}

module.exports = Prediction;
