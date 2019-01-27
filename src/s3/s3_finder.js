const S3Directory = require('./s3_directory.js');
const parseDirDate = require('../util/date_util.js').parseDirDate;
const formatTarName = require('../util/date_util.js').formatTarName;
const dateDiff = require('../util/date_diff.js')
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

        let minDiff = null;
        let bestDir = null;
        
        await dirs.forEach(async s3Dir => {
            const dirName = s3Dir.path;
            const dirDt = parseDirDate(dirName);
            const diff = dateDiff(momentDate, dirDt);

            if (dirDt.isValid()) {
                if (this._isAcceptableDiff(diff) &&
                    (minDiff === null || diff < minDiff)) {
                    const containsExpected = await this._containsDay(
                        s3Dir, momentDate, predictionType);
                        
                    if (containsExpected) {
                        log.debug('Switching best matching dir to ' + dirName);
                        minDiff = diff;
                        bestDir = dirName;
                    }
                }    
            } else {
                log.warn(`Invalid directory in ${this.bucketName} bucket: ` +
                    dirName);
            }
        });

        if (bestDir) {
            log.info(`Found best matching directory for ${momentDate.format()}: ${bestDir}`);
            return new S3Directory(bestDir);
        } else {
            log.warn(`Didn't find any matching dir for ${momentDate.format()}`);
        }

    }

    async _containsDay(s3Dir, momentDate, predictionType) {
        const files = await s3Dir.listFiles();

        const expectedFileName = formatTarName(momentDate, predictionType);
        const contains = false;
        files.foreach(file => {
            if (file.fileName === expectedFileName) {
                contains = true;
            }
        });

        return contains;
    }
    
    _isAcceptableDiff(diff) {
        return diff <= settings.PRED_MAX_MINUTES_DIFF;
    }
}

module.exports = S3Finder;
