const S3Directory = require('./s3_directory.js');
const parseDirDate = require('../util/date_util.js').parseDirDate;
const formatTarName = require('../util/date_util.js').formatTarName;
const dateDiffMinutes = require('../util/date_diff.js').dateDiffMinutes;
const log = require('../util/log.js');
const settings = require('../util/settings.js');

class S3Finder {

    constructor(bucketName) {
        this.bucketName = bucketName;
    }

    async findClosest(momentDate, predictionType) {
        log.debug('Looking for closest dir matching to: ' +
            momentDate.format());

        const root = new S3Directory(this.bucketName, '');
        const dirs = await root.listDirectories();

        const dirsByDiff = {};
        
        await Promise.all(dirs.map(async s3Dir => {
            const dirName = s3Dir.path;
            const dirDt = parseDirDate(dirName);
            const diff = dateDiffMinutes(momentDate, dirDt);

            if (dirDt.isValid()) {
                if (this._isAcceptableDiff(diff)) {
                    const containsExpected = await this._containsDay(
                        s3Dir, momentDate, predictionType);
                        
                    if (containsExpected) {
                        log.debug(`Considering ${dirName} with ${diff}`);
                        dirsByDiff[diff] = s3Dir;
                    }
                }    
            } else {
                log.warn(`Invalid directory in ${this.bucketName} bucket: ` +
                    dirName);
            }
        }));

        log.info(`Found these matching dirs for ${momentDate.format()}: `
            + JSON.stringify(dirsByDiff));

        let bestDir = null;

        if (Object.keys(dirsByDiff).length > 0) {
            let minDiff = null;
            Object.keys(dirsByDiff).forEach(key => {
                const diff = parseInt(key); 
                if (minDiff === null || 
                    Math.abs(diff) < Math.abs(minDiff)) {
                    
                    bestDir = dirsByDiff[key];
                    minDiff = diff;
                }
            });

            log.info(`Found best matching directory for ${momentDate.format()}: ${bestDir.path}`);
        } else {
            log.warn(`Didn't find any matching dir for ${momentDate.format()}`);
        }
        
        return bestDir;
    }

    async _containsDay(s3Dir, momentDate, predictionType) {
        const files = await s3Dir.listFiles();

        const expectedFileName = formatTarName(momentDate, predictionType);
        let contains = false;
        files.forEach(file => {
            if (file.fileName === expectedFileName) {
                contains = true;
            }
        });

        return contains;
    }
    
    _isAcceptableDiff(diff) {
        return Math.abs(diff) <= settings.PRED_MAX_MINUTES_DIFF;
    }
}

module.exports = S3Finder;
