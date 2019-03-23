const S3Directory = require('./s3/s3_directory')
const Transformer = require('./transformer')
const settings = require('./util/settings')
const log = require('../../ksgmet-downloader/src/util/log')

async function runTransformations(startIndex, endIndex) {
    const transformer = new Transformer();

    const rootDir = new S3Directory(settings.S3_BUCKET_NAME, '');
    const subDirs = await rootDir.listDirectories();
    
    for (const i = startIndex; i < endIndex; i++) {
        await processDir(subDirs[i], transformer);
    }
}

async function processDir(dir, transformer) {
    log.info('Starting transformation on directory: ' + dir);
    return transformer.transform(dir.path);
}

module.exports = runTransformations;
