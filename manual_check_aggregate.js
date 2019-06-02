const log = require('./src/util/log');
const settings = require('./src/util/settings');
const S3File = require('./src/s3/s3_file');
const FileStore = require('./src/files/file_store');;
const checkAggregate = require('./src/db/check_aggregate');

const PATH = '2018_11_18_12/23h';

async function manualCheckAggregate(path) {
    const store = new FileStore();

    const pathToFile = `${settings.TARGET_SORT_PREFIX}/${path}`;

    const file = new S3File('aggregate.csv', pathToFile, settings.TARGET_BUCKET);

    const localFilePath = await file.fetch(store);

    checkAggregate(localFilePath);

    await file.rmLocalFile();
}

manualCheckAggregate(PATH).then(() => log.info('Done'));
