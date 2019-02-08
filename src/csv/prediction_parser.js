const CsvFileBuilder = require('./csv_file_builder.js');
class PredictionParser {

    constructor(predictionPath, targetDir) {
        this.predictionPath = predictionPath;
        this.targetDir = targetDir;

        const csvFileBuilder = new CsvFileBuilder(predictionPath);

        this.files = csvFileBuilder.build();
    }

    _readPredictionUnits() {
        let unit;
        do {
            unit = this._readSinglePredictionUnit();
            
            if (unit) {

            }
        } while (unit);
    }

    _readSinglePredictionUnit() {
        const unit = {};
        let anyFileHadValue = false;

        files.forEach(file => {
            const val = file.nextCell();
            let valAsNum = null;
            if (val) {
                valAsNum = new Number(val);
                anyFileHadValue = true;
            }

            unit[file.varName] = valAsNum;
        });

        return anyFileHadValue ? unit : null;
    }
}

module.exports = PredictionParser;
