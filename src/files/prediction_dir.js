const DirReader = require('./dir_reader.js');
const Prediction = require('./prediction.js');
const PredictionType = require('../util/prediction_type.js');

class PredictionDir {
     
    constructor(filePath) {
        this.filePath = filePath;
    }

    listPredictions() {
        const dirs = DirReader.recursivelyFindBottomDirs(this.filePath);
        return dirs.map(dir => new Prediction(dir));
    }

    isPl() {
        return this.filePath.indexOf(PredictionType.PL.TAR_PREFIX) >= 0;
    }

    isEurope() {
        return this.filePath.indexOf(PredictionType.EU.TAR_PREFIX) >= 0;
    }
}

module.exports = PredictionDir;
