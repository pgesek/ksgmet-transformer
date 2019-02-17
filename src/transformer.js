const log = require('./util/log.js');
const settings = require('./util/settings.js');
const S3Directory = require('./s3/s3_directory.js');
const FileStore = require('./files/file_store.js');
const S3Finder = require('./s3/s3_finder.js');
const tarName = require('./util/date_util.js').tarName;
const formatPredictionPath = require('./util/date_util.js').formatPredictionPath;
const PredictionParser = require('./csv/prediction_parser');

class Transformer {

    constructor() {
        this.store = new FileStore(); 
        this.s3Finder = new S3Finder(settings.S3_BUCKET_NAME);
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

            const resultDir = await this.store.buildResultDir();

            const predictions = predDir.listPredictions();
            
            predictions.forEach(pred => this._processPrediction(
                pred, resultDir));

            await this.store.rmResultDir();
        });

        log.info('Fetched directory: ' + directory);
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

            // prediction and actual data prediction build the CSVs
            if (actualDataPrediction) {
                // mod dates verification
                const parser = new PredictionParser(prediction,
                    actualDataPrediction, resultDir);
                
                await parser.parsePredictionUnits();
            } else {

            }
        } else {
            log.warn('No actual data available, skipping prediction: ' +
                prediction.dirPath);
        }
    }
}

module.exports = Transformer;
