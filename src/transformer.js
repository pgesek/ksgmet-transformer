const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');
const S3Finder = require('./s3/s3_finder.js');
const formatTarName = require('./util/date_util.js').formatTarName;
const formatPredictionPath = require('./util/date_util.js').formatPredictionPath;
const PredictionParser = require('./csv/prediction_parser');
const S3Uploader = require('./s3/s3_uploader');
const dateDiffMinutes = require('./util/date_diff.js').dateDiffMinutes;
const PredictionType = require('./util/prediction_type');

class Transformer {

    constructor() {
        this.store = new FileStore(); 
        this.s3Finder = new S3Finder(settings.S3_BUCKET_NAME);
        this.S3Uploader = new S3Uploader(settings.TARGET_BUCKET, 
            settings.TARGET_PREFIX);
    }

    async transform(directory) {
        const s3directory = new S3Directory(settings.S3_BUCKET_NAME,
            directory);
        
        log.info('Fetched directory: ' + directory);
        
        const files = await s3directory.listFiles();

        return Promise.all(files.map(async s3file => {
            if (PredictionType.isPredictionTar(s3file.fileName)) {
                await this._processTarFile(s3file);
            } else {
                log.info('Skipping tar: ' + s3file.fileName);
            }
        }));
    }

    async _processTarFile(s3file) {
        log.info(`Processing file:${s3file.path}/${s3file.fileName}`);

        await s3file.fetch(this.store, s3file.fileNameNoExt());
            
        const predDir = await this.store.untar(s3file.fileNameNoExt(),
            s3file);

        log.info('Created prediction directory: ' + 
            predDir.filePath);

        s3file.rmLocalFile();

        const resultDir = await this.store.buildResultDir(s3file.fileNameNoExt());

        const predictions = predDir.listPredictions();
        
        predictions.forEach(pred => this._processPrediction(
            pred, resultDir, s3file.fileNameNoExt()));

        log.info('Finished processing predictions from: ' +
            this.s3Finder.fileName);

        if (settings.CLEAN_RESULT_DIR) {
            await this.store.rmResultDir(s3file.fileName);
        } else {
            log.info('Skipping removal of result dir');
        }
    }

    async _processPrediction(prediction, resultDir, parentTarName) {
        log.info('Processing prediction: ' + prediction.dirPath);
        
        const predictionDate = prediction.getPredictionDate();
        const predictionType = prediction.predictionType;

        const actualDataS3Dir = await this.s3Finder.findClosest(predictionDate,
            predictionType);

        if (actualDataS3Dir) {
            log.info(`Using ${actualDataS3Dir.path} as actual data directory`);

            const actualTarName = formatTarName(predictionDate, predictionType);
            const actualDataFile = actualDataS3Dir.getFileHandle(actualTarName);

            await actualDataFile.fetch(this.store, parentTarName);
            const actualDataDir = await this.store.untar(
                parentTarName, actualDataFile);
            actualDataFile.rmLocalFile();

            const actualDataPath = formatPredictionPath(predictionDate,
                predictionType);
            const actualDataPrediction = actualDataDir.getPredictionHandle(
                actualDataPath);

            log.info('Using the following actual data prediction: ' +
                actualDataPrediction.dirPath);

            if (actualDataPrediction &&
                this._verifyActualModDate(actualDataPrediction)) {
                
                const parser = new PredictionParser(prediction,
                    actualDataPrediction, resultDir);
                
                const resultFile = await parser.parsePredictionUnits();

                if (settings.UPLOAD_TO_S3) {
                    await this.S3Uploader.uploadFile(resultFile);
                } else {
                    log.info('S3 Upload disabled, skipping');
                }
            } else {
                log.warn('Have to skip prediction: ')
            }
        } else {
            log.warn('No actual data available, skipping prediction: ' +
                prediction.toString());
        }
    }

    _verifyActualModDate(actualDataPrediction) {
        const predDate = actualDataPrediction.getPredictionDate();
        const madeOn = actualDataPrediction.getMadeOnDate();

        const diff = Math.abs(dateDiffMinutes(predDate, madeOn));

        if (diff > settings.ACTUAL_MAX_MINUTES_DIFF) {
            log.warn(`Prediction ${actualDataPrediction.toString()}`
                + ` is too far away to be considered an actual data `
                + `prediction`);
            return false;
        } else {
            return true;
        }
    }
}

module.exports = Transformer;
