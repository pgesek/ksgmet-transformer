const log = require('../util/log.js');
const settings = require('../util/settings.js');
const PredictionParser = require('../csv/prediction_parser');


class PredictionCollectionTransformer {
    
    constructor(store, s3Uploader) {
        this.store = store;
        this.s3Uploader = s3Uploader;
    }

    async transformCollection(collection) {
        const actualThreshold = parseInt(settings.ACTUAL_THRESHOLD);
        
        log.info('Processing collection of: ' + collection.date);
        const predsToTransform = collection.getPredsWeCanVerify(actualThreshold);
        if (predsToTransform.length > 0) {
            await this._transformPredictions(predsToTransform, collection.getActual(actualThreshold));
            log.info('Completed transformation for collection of: ' + collection.date);
        } else {
            log.info('No parseable predictions for collection of: ' + collection.date);
        }
    }

    async _transformPredictions(predsToTransform, actualS3Pred) {
        const actualPred = await actualS3Pred.download(this.store);

        log.info(`Fetched actual, diff: ${actualPred.predLength}h`)

        await Promise.all(predsToTransform.map(async pred => {
            await this._transformPrediction(pred, actualPred);
        }));

        await store.rmDir(actualPred.dirPath);
    }

    async _transformPrediction(s3Pred, actualPred) {
        log.info(`Transforming ${s3Pred}`);

        const resultDirName = `results_${s3Pred.predDate}_${s3Pred.predLength}h` 
        const resultDir = await this.store.buildResultDir(resultDirName);

        const pred = await s3Pred.download(this.store);

        const parser = new PredictionParser(pred, actualPred, resultDir); 

        const resultFile = await parser.parsePredictionUnits();

        log.info(`Finished transforming ${s3Pred}`);

        if (settings.UPLOAD_TO_S3) {
            const uploadPrefix = `${pred.predDate}/${pred.predLength}h`;

            const fileToUpload = {
                filePath: resultFile,
                prefix: uploadPrefix
            };

            await this.s3Uploader.uploadFile(fileToUpload);
        } else {
            log.info('S3 Upload disabled, skipping');
        }

        if (settings.CLEAN_RESULT_DIR) {
            await this.store.rmDir(resultDir);
        }

        await this.store.rmDir(pred.dirPath);
    }
}

module.exports = PredictionCollectionTransformer;
