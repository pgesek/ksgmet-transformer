const log = require('./util/log.js');
const settings = require('./util/settings.js');


class PredictionCollectionTransformer {
    
    constructor(store, s3Uploader) {
        this.store = store;
        this.s3Uploader = s3Uploader;
    }

    async transformCollection(collection) {
        log.info('Processing collection of: ' + collection.date);
        const predsToTransform = collection.getPredsWeCanVerify();
        if (predsToTransform.length > 0) {
            await this._transformPredictions(predsToTransform, collection.getActual());
            log.info('Completed transformation for collection of: ' + collection.date);
        } else {
            log.info('No parseable predictions for collection of: ' + collection.date);
        }
    }

    async _transformPredictions(predsToTransform, actualS3Pred) {
        const actualPred = await actualS3Pred.download(this.store);
        
        await Promise.all(predsToTransform.map(async pred => 
            this._transformPrediction(pred, actualPred)));
    }

    async _transformPrediction(s3Pred, actualPred) {
        const resultDirName = `results_${s3Pred.predDate}_${s3Pred.predLength}h` 
        const resultDir = this.store.buildResultDir(resultDirName);

        const pred = await s3Pred.download(this.store);

        // upload

        await this.store.rmResultDir(resultDir);
    }
}

module.exports = PredictionCollectionTransformer;
