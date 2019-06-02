const S3Directory = require('../s3/s3_directory');
const settings = require('../util/settings');
const log = require('../util/log');
const S3PredictionParent = require('../s3/s3_prediction_parent');
//const moment = require('moment-timezone');

async function findAggregateDirs() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);

    const dirsToUse = await rootDir.findChildrenThatMatch(
        async s3Dir => {
            //const date = moment.tz(s3Dir.name, DIR_FORMAT, settings.TIMEZONE);
            const childCount = await s3Dir.countChildren();

            return await s3Dir.hasChildrenThatMatch(childDir => {
                const length = parseInt(childDir.name);
                return childCount > 1 && length <= 0; //&& date.isBefore('2019-01-01');
            });
        }
    );

    let children = await Promise.all(dirsToUse.map(async dir => {

        const predParent = new S3PredictionParent(dir);
        const predCollection = await predParent.listPredictionDirs();
        const actual = predCollection.getActual(settings.ACTUAL_THRESHOLD);
        const hasBadActual = await actual.isBad();

        return await dir.findChildrenThatMatch(async childDir => {
            if (hasBadActual) {
                return false;
            }

            const length = parseInt(childDir.name);
            const hasGoodLength = length >= 4;

            const fileCount = await childDir.countFiles();
            const hasBadFileCount = fileCount < 31;

            return !hasBadFileCount && hasGoodLength;
        });
    }));

    // flatten array
    children = [].concat.apply([], children);

    log.info('Aggregates that will be used: ' + children.length);

    return children;
}

module.exports = findAggregateDirs;