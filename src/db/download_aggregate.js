const s3Retry = require('../s3/s3_retry')
const log = require('../util/log')
const nodeCmd = require('node-cmd');
const promisify = require('util').promisify;

async function downloadAggregate(s3PredDir, store, dirPrefix) {
    const file = s3PredDir.getFileHandle('aggregate.csv');
    log.info('Downloading: ' + file);    
    
    const path = await s3Retry(() => file.fetch(store, dirPrefix));
    
    const cmdPromise = promisify(nodeCmd.get);

    const cmd = `icacls "${path}" /grant Everyone:R`;
    
    await cmdPromise(cmd);
    
    return path;
}

module.exports = downloadAggregate;
