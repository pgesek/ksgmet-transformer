const FileStore = require('./files/file_store');
const S3Directory = require('./s3/s3_directory');
const tagCsvFiles = require('./sort/csv_tagger');
const S3Uploader = require('./s3/s3_uploader');
const settings = require('./util/settings');
const log = require('./util/log');

class CsvSorter {

    constructor() {
        this.store = new FileStore(); 
        this.s3Uploader = new S3Uploader(settings.TARGET_BUCKET, 
            settings.TARGET_SORT_PREFIX);
    }

    async sortTars(directory, tarFilter) {
        const s3directory = new S3Directory(settings.S3_BUCKET_NAME,
            directory);

        log.info('Fetched directory: ' + directory);

        let files = await s3directory.listFiles();

        files = files.filter(tarFilter);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await this.processTarFile(file);
        }

        log.info('Finished sorting directory: ' + directory);
    }

    async processTarFile(s3TarFile) {
        log.info(`Processing file:${s3TarFile.path}/${s3TarFile.fileName}`);
        
        await s3TarFile.fetch(this.store, s3TarFile.fileNameNoExt());

        const predDir = await this.store.untar(s3TarFile.fileNameNoExt(),
            s3TarFile);

        log.info('Created prediction directory: ' + predDir.filePath);

        s3TarFile.rmLocalFile();

        const predictions = predDir.listPredictions();

        await Promise.all(predictions.map(async pred => {
            await this._processPrediction(pred, s3TarFile.fileNameNoExt());
        }));

        predDir.rm();

        log.info('Finished processing tar: ' + s3TarFile.fileName);
    }

    async _processPrediction(prediction) {
        log.info('Processing prediction: ' + prediction.toString());

        const files = tagCsvFiles(prediction);

        await Promise.all(files.map(async file => {
            await this.s3Uploader.uploadFile(file);
        }))

        log.info('Finished processing prediction: ' + prediction.toString());
    }
}

module.exports = CsvSorter;
