const S3Directory = require('../src/s3/s3_directory');
const settings = require('../src/util/settings');
const log = require('../src/util/log');
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
        return await dir.findChildrenThatMatch(childDir => {
            const length = parseInt(childDir.name);
            return length >= 4;  
        });
    }));

    children = children.flat();

    log.info('Aggregates that will be used: ' + children.length);

    return children;
}

module.exports = findAggregateDirs;