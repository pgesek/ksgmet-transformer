const CsvFileBuilder = require('./csv_file_builder.js');
const CsvResultFile = require('./csv_result_file.js');
const csvResultFilename = require('./csv_result_filename.js');
const addDeltas = require('../util/add_deltas.js');
const addDimValues = require('./add_dim_values');
const log = require('../util/log');

class PredictionParser {

    constructor(prediction, actualData, targetDir) {
        
        this.predictionPath = prediction.dirPath;
        this.actualDataPath = actualData.dirPath;
        this.targetDir = targetDir;

        this.madeOnDt = prediction.getMadeOnDate();
        this.predictionDt = prediction.getPredictionDate();

        const predictionCsvFileBuilder = new CsvFileBuilder(
            this.predictionPath, '_predicted');
        this.predictionFiles = predictionCsvFileBuilder.build();

        const actualCsvFileBuilder = new CsvFileBuilder(
            this.actualDataPath, '_actual');
        this.actualFiles = actualCsvFileBuilder.build();

        this.predictionType = prediction.predictionType;
    }

    async parsePredictionUnits() {
        const resultFileName = csvResultFilename(this.targetDir,
            this.madeOnDt, this.predictionDt,
            this.predictionType);

        const resultFile = new CsvResultFile(resultFileName);

        let unit;
        do {
            unit = this._readSinglePredictionUnit();
            
            if (unit) {
                unit = addDeltas(unit);
                unit = addDimValues(unit, {
                    predictionType: this.predictionType,
                    predictionDt: this.predictionDt,
                    madeOnDt: this.madeOnDt
                });

                resultFile.writeUnit(unit);
            }
        } while (unit);

        await resultFile.end();

        return resultFileName;
    }

    _readSinglePredictionUnit() {
        const unit = {};
        let anyFileHadValue = false;
        const filesNoValue = [];

        const files = this.predictionFiles.concat(this.actualFiles);

        files.forEach(file => {
            const cell = file.nextCell();
            let val = null;
            if (cell) {
                val = cell.value;

                anyFileHadValue = true;

                if (!unit.x) {
                    unit.x = cell.x;
                    unit.y = cell.y;
                }
            } else {
                filesNoValue.push(fil.varName);
            }

            unit[file.varName] = val;
        });

        if (anyFileHadValue && filesNoValue.length > 0) {
            log.warn('Missing fields for prediction unit: ' + filesNoValue);
        }

        return anyFileHadValue ? unit : null;
    }
}

module.exports = PredictionParser;
