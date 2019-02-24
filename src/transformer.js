const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');
const S3Finder = require('./s3/s3_finder.js');
const tarName = require('./util/date_util.js').tarName;
const formatPredictionPath = require('./util/date_util.js').formatPredictionPath;
const PredictionParser = require('./csv/prediction_parser');
const S3Uploader = require('./s3/s3_uploader');
const dateDiffMinutes = require('./util/date_diff.js').dateDiffMinutes;

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

        files.forEach(async s3file => this._processTarFile(s3file));
    }

    async _processTarFile(s3file) {
        log.info(`Processing file:${s3file.path}/${s3file.fileName}`);

        await s3file.fetch(this.store);
            
        const predDir = await this.store.untar(s3file);

        log.info('Created prediction directory: ' + 
            predDir.filePath);

        s3file.rmLocalFile();

        const resultDir = await this.store.buildResultDir();

        const predictions = predDir.listPredictions();
        
        predictions.forEach(pred => this._processPrediction(
            pred, resultDir));

        await this.store.rmResultDir();
    }

    _processPrediction(prediction, resultDir) {
        log.info('Processing prediction: ' + prediction.dirPath);
        
        const predictionDate = prediction.getPredictionDate();
        const predictionType = prediction.predictionType;

        const actualDataDir = this.s3Finder.findClosest(predictionDate,
            predictionType);

        if (actualDataDir) {
            log.info(`Using ${actualDataDir.path} as actual data directory`);

            const actualTarName = tarName(predictionDate);
            const actualDataFile = actualDataDir.getFileHandle(actualTarName);

            await actualDataFile.fetch(this.store);
            const actualDataDir = await this.store.untar(actualDataFile);
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

                await this.S3Uploader.uploadFile(resultFile);
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
