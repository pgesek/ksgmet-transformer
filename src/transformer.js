const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');
const S3Finder = require('./s3/s3_finder.js');
const formatTarName = require('./util/date_util.js').formatTarName;
const formatPredictionPath = require('./util/date_util.js').formatPredictionPath;
const PredictionParser = require('./csv/prediction_parser');
const S3Uploader = require('./s3/s3_uploader');
const PredictionType = require('./util/prediction_type');
const path = require('path');

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

        await Promise.all(files.map(async s3file => {
            if (PredictionType.isPredictionTar(s3file.fileName)) {
                await this._processTarFile(s3file);
            } else {
                log.info('Skipping tar: ' + s3file.fileName);
            }
        }));

        log.info('Finished transformation of directory: ' + directory);
    }

    async _processTarFile(s3file) {
        log.info(`Processing file:${s3file.path}/${s3file.fileName}`);

        await s3file.fetch(this.store, s3file.fileNameNoExt());
            
        const predDir = await this.store.untar(s3file.fileNameNoExt(),
            s3file);

        log.info('Created prediction directory: ' + 
            predDir.filePath);

        // await s3file.rmLocalFile();

        const resultDir = await this.store.buildResultDir(s3file.fileNameNoExt());

        const predictions = predDir.listPredictions();
        
        await Promise.all(predictions.map(async pred => {
            if (pred.isFuturePrediction()) {
                await this._processPrediction(pred, resultDir, 
                    s3file.fileNameNoExt());
            } else {
                log.info('Skipping non-future prediction: ' + pred);
            }
        }));

        log.info('Finished processing predictions from: ' +
            s3file.fileName);

        if (settings.CLEAN_RESULT_DIR) {
            await this.store.rmResultDir(s3file.fileName);
        } else {
            log.info('Skipping removal of result dir');
        }
    }

    async _processPrediction(prediction, resultDir, parentTarName) {
        log.info('Processing prediction: ' + prediction.toString());
        
        const predictionDate = prediction.getPredictionDate();
        const predictionType = prediction.predictionType;

        const actualDataS3Dir = await this.s3Finder.findClosest(predictionDate,
            predictionType);

        if (actualDataS3Dir) {
            log.info(`Using ${actualDataS3Dir.} as actual data directory`);

            const actualTarName = formatTarName(predictionDate, predictionType);
            const actualDataFile = actualDataS3Dir.getFileHandle(actualTarName);

            const prefix = path.join(parentTarName, 'actual_for_' + 
                prediction.toPath());

            await actualDataFile.fetch(this.store, prefix);
            const actualDataDir = await this.store.untar(
                prefix, actualDataFile);
            await actualDataFile.rmLocalFile();

            const actualDataPath = formatPredictionPath(predictionDate,
                predictionType);
            const actualDataPrediction = actualDataDir.getPredictionHandle(
                actualDataPath);

            if (!actualDataPrediction) {
                log.warn(`Determined actual prediction file ${actualDataS3Dir.name}/` +
                    `${actualTarName} does not contain expected prediction: ${actualDataPath}. ` +
                    `Skipping.`);
                return;
            }

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
                log.warn('Have to skip prediction: ' + prediction.toString());
            }
        } else {
            log.warn('No actual data available, skipping prediction: ' +
                prediction.toString());
        }
    }

    _verifyActualModDate(actualDataPrediction) {
        const diff = actualDataPrediction.getMinuteDiff();

        if (diff > settings.ACTUAL_MAX_MINUTES_DIFF) {
            log.warn(`${actualDataPrediction.toString()}`
                + ` is too far away to be considered an actual data `
                + `prediction`);
            return false;
        } else {
            log.info(`${actualDataPrediction.toString()}`
                + ` accepted as actual data`);
            return true;
        }
    }
}

module.exports = Transformer;
