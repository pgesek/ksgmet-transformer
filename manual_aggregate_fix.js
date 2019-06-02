const S3Directory = require('./src/s3/s3_directory');
const settings = require('./src/util/settings');
const log = require('./src/util/log');
const S3PredictionParent = require('./src/s3/s3_prediction_parent');

async function fixAggregates() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);

    const predCollDirs = await rootDir.listDirectories();
 
    const actualThreshold = parseInt(settings.ACTUAL_THRESHOLD);

    let badActuals = 0;
    let fixableActuals = [];

    let children = await Promise.all(predCollDirs.map(async dir => {
        
        const predParent = new S3PredictionParent(dir);
        const predCollection = await predParent.listPredictionDirs();

        const actual = predCollection.getActual(actualThreshold);
        const actualName = actual ? actual.s3Dir.name : null;

        return await dir.findChildrenThatMatch(async childDir => {
            const isBad = await isBadDir(childDir);
            if (isBad) {
                log.info(`Bad dir: ${childDir.path}.`);
            }
            
            const isAcutal = childDir.name === actualName;
            if (isBad && isAcutal) {
                log.info('This is also an actual dir !!!');
                badActuals++;

                if (predCollection.hasActual(actualThreshold, 1)) {
                    log.info('Can be fixed however !!!');
                    fixableActuals.push(dir);
                }
            }

            return isBad;
        });
    }));

    // flatten array
    children = [].concat.apply([], children);

    log.info('Bad directories found: ' + children.length);
    log.info('Bad actual dirs: ' + badActuals);
    log.info('Fixable dirs: ' + fixableActuals);

    return fixableActuals;
}

async function isBadDir(dir) {
    const fileCount = await dir.countFiles();
    return fileCount < 31;
}

fixAggregates().then(() => log.info('Done'));
