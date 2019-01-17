const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');

class Transformer {

    constructor() {
        this.store = new FileStore(); 
    }

    async transform(directory) {
        const s3directory = new S3Directory(settings.S3_BUCKET_NAME,
            directory);
        
        const files = await s3directory.listFiles();

        await Promise.all(files.map(file => {
            return file.fetch(this.store);
        }));

        log.info('Fetched directory: ' + directory);
    }
}

module.exports = Transformer;
