const s3Retry = require('../s3/s3_retry')
const log = require('../util/log')


async function downloadAggregate(s3PredDir, store, dirPrefix) {
    const file = s3PredDir.getFileHandle('aggregate.csv');
    log.info('Downloading: ' + file);    
    return await s3Retry(() => file.fetch(store, dirPrefix));
}

module.exports = downloadAggregate;
