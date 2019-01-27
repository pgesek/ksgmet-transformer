const DirReader = require('./dir_reader.js');
const Prediction = require('./prediction.js');

const PL = 'pl_csv';
const EUROPE_LONG = 'europe_long_csv';

class PredictionDir {
     
    constructor(filePath) {
        this.filePath = filePath;
    }

    listPredictions() {
        const dirs = DirReader.recursivelyFindBottomDirs(this.filePath);
        return dirs.map(dir => new Prediction(dir));
    }

    isPl() {
        return this.filePath.indexOf(PL) >= 0;
    }

    isEurope() {
        return this.filePath.indexOf(EUROPE_LONG) >= 0;
    }
}

module.exports = PredictionDir;
