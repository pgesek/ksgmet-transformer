const CsvFileBuilder = require('./csv_file_builder.js');
class PredictionParser {

    constructor(predictionPath, targetDir) {
        this.predictionPath = predictionPath;
        this.targetDir = targetDir;

        const csvFileBuilder = new CsvFileBuilder(predictionPath);

        this.files = csvFileBuilder.build();
    }

    
}

module.exports = PredictionParser;
