const S3Directory = require('../src/s3/s3_directory');
const settings = require('../src/util/settings');
const S3PredictionCollection = require('../src/s3/s3_prediction_collection');
const log = require('../src/util/log');


async function dirsToUse() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);
    
    const count = await rootDir.countChildrenThatMatch(
        async s3Dir => await s3Dir.hasChildrenThatMatch(
            childDir => childDir.name.includes('/-')));

    log.info('Number of predictions with a 2h prediction: ' + count);
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

listPredictionsInDir().then(() => log.info('Done'));
