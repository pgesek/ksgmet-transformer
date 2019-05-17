const S3Directory = require('../src/s3/s3_directory');
const settings = require('../src/util/settings');
const S3PredictionCollection = require('../src/s3/s3_prediction_collection');
const log = require('../src/util/log');
const moment = require('moment-timezone');

const DIR_FORMAT = 'YYYY_MM_DD_HH_mm_ss';

async function dirsToUse() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);

    const dirsToUse = await rootDir.findChildrenThatMatch(
        async s3Dir => {
            const date = moment.tz(s3Dir.name, DIR_FORMAT, settings.TIMEZONE);
            const childCount = await s3Dir.countChildren();

            return await s3Dir.hasChildrenThatMatch(childDir => {
                const length = parseInt(childDir.name);
                return childCount > 1 && length <= 0; //&& date.isBefore('2019-01-01');
            });
        }
    );
 
    const counts = await Promise.all(dirsToUse.map(async dir => {
        return await dir.countChildrenThatMatch(childDir => {
            const length = parseInt(childDir.name);
            return length >= 4;  
        });
    }));

    const aggregatesToUse = counts.reduce((aggregate, currentVal) => aggregate + currentVal);

    log.info(`Prediction collections to use: ${dirsToUse.length}. Number of aggregates we will be using: ${aggregatesToUse}`);
}

async function listPredictionsInDir() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);
    
    const predCollDirs = await rootDir.listDirectories();
    const predCollDir = predCollDirs[3700];
    log.info('S3: '+ predCollDir);

    const predColl = new S3PredictionCollection(predCollDir);

    log.info('Collection: ' + predColl);

    const predDirs = await predColl.listPredictionDirs();

    log.info('Preds: ' + predDirs);
}

dirsToUse().then(() => log.info('Done'));
