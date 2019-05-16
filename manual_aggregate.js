const settings = require('./src/util/settings');
const log = require('./src/util/log');
const PredictionCollectionTransformer = require('./src/transformer/prediction_collection_transformer');
const FileStore = require('./src/files/file_store');
const S3Uploader = require('./src/s3/s3_uploader');
const S3Directory = require('./src/s3/s3_directory');
const S3PredictionParent = require('./src/s3/s3_prediction_parent');

const START = 20;
const END = 50;

async function execute() {
    const fileStore = new FileStore();
    const s3Uploader = new S3Uploader(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);

    const transformer = new PredictionCollectionTransformer(fileStore, s3Uploader);

    const rootDir = new S3Directory(settings.TARGET_BUCKET, settings.TARGET_SORT_PREFIX);
    const subDirs = await rootDir.listDirectories();

    log.info('Number of dirs to aggregate: ' + subDirs.length);

    for (let i = START; i < END; i += 1) {
        const dir = subDirs[i];

        const predParent = new S3PredictionParent(dir);
        const predCollection = await predParent.listPredictionDirs();

        log.info('Aggregating predictions from: ' + dir.name);

        await transformer.transformCollection(predCollection);

        log.info('Finished aggregating predictions from: ' + dir.name);
    }

    log.info('Finished execution');
}

execute().then(() => log.info('Done'));
