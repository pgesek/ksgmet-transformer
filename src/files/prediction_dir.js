const del = require('del');
const DirReader = require('./dir_reader.js');
const Prediction = require('./prediction.js');
const PredictionType = require('../util/prediction_type.js');
const fs = require('fs');
const path = require('path');

class PredictionDir {
     
    constructor(filePath) {
        this.filePath = filePath;
    }

    listPredictions() {
        const dirs = DirReader.recursivelyFindBottomDirs(this.filePath);
        return dirs.map(dir => new Prediction(dir));
    }

    getPredictionHandle(predictionPath) {
        const fullPath = path.join(this.filePath, predictionPath);
        if (fs.existsSync(fullPath)) {
            return new Prediction(fullPath);
        } else {
            return null;
        }
    }

    isPl() {
        return this.filePath.indexOf(PredictionType.PL.TAR_PREFIX) >= 0;
    }

    isEurope() {
        return this.filePath.indexOf(PredictionType.EU.TAR_PREFIX) >= 0;
    }

    async rm() {
        await del([this.filePath], { force: true });
    }
}

module.exports = PredictionDir;
