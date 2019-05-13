const settings = require('./src/util/settings');
const log = require('./src/util/log');
const PredictionCollectionTransformer = require('./src/transformer/prediction_collection_transformer');
const FileStore = require('./src/files/file_store');
const S3Uploader = require('./src/s3/s3_uploader');
const S3Directory = require('./src/s3/s3_directory');
const S3PredictionParent = require('./src/s3/s3_prediction_parent');


async function execute() {
    const fileStore = new FileStore();
    const s3Uploader = new S3Uploader(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);

    const transformer = new PredictionCollectionTransformer(fileStore, s3Uploader);

    const s3Dir = new S3Directory(settings.TARGET_BUCKET,
        '2019_05_09_08', settings.TARGET_SORT_PREFIX);

    const predParent = new S3PredictionParent(s3Dir);
    const predCollection = await predParent.listPredictionDirs();

    await transformer.transformCollection(predCollection);

    log.info('Finished');
}

execute().then(() => log.info('Done'));
