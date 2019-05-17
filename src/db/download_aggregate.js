const s3Retry = require('../s3/s3_retry')

async function downloadAggregate(s3PredDir, store, dirPrefix) {
    const file = s3PredDir.getFileHandle(s3PredDir);
    await s3Retry(() => file.fetch(store, dirPrefix));
}

module.exports = downloadAggregate;
