const CsvFileBuilder = require('./csv_file_builder.js');
const CsvResultFile = require('./csv_result_file.js');
const csvResultFilename = require('./csv_result_filename.js');
const addDeltas = require('../util/add_deltas.js');

class PredictionParser {

    constructor(predictionPath, actualDataPath, targetDir,
        predictionDt, predictedForDt) {
        
        this.predictionPath = predictionPath;
        this.actualDataPath = actualDataPath;
        this.targetDir = targetDir;

        this.predictionDt = predictionDt;
        this.predictedForDt = predictedForDt;

        const predictionCsvFileBuilder = new CsvFileBuilder(
            predictionPath, '_predicted');
        this.predictionFiles = predictionCsvFileBuilder.build();

        const actualCsvFileBuilder = new CsvFileBuilder(
            actualDataPath, '_actual');
        this.actualFiles = actualCsvFileBuilder.build();
    }

    readPredictionUnits() {
        const resultFileName = csvResultFilename(this.targetDir,
            this.predictionDt, this.predictedForDt);

        const resultFile = new CsvResultFile(resultFileName);

        let unit;
        do {
            unit = this._readSinglePredictionUnit();
            
            if (unit) {
                unit = addDeltas(unit);

                resultFile.writeUnit(unit);
            }
        } while (unit);

        resultFile.end();
    }

    _readSinglePredictionUnit() {
        const unit = {};
        let anyFileHadValue = false;

        const files = this.predictionFiles.concat(this.actualFiles);

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
