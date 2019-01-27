const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');
const PredictionDir = require('./files/prediction_dir.js');

class Transformer {

    constructor() {
        this.store = new FileStore(); 
    }

    async transform(directory) {
        const s3directory = new S3Directory(settings.S3_BUCKET_NAME,
            directory);
        
        const files = await s3directory.listFiles();

        await files.forEach(async s3file => {
            await s3file.fetch(this.store);
            
            const predDir = await this.store.untar(s3file);

            log.info('Created prediction directory: ' + 
                predDir.filePath);

            s3file.rmLocalFile();

            const predictions = predDir.listPredictions();
        });

        log.info('Fetched directory: ' + directory);
    }
}

module.exports = Transformer;
