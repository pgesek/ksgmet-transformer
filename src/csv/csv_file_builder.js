const fs = require('fs');
const path = require('path');
const CsvFile = require('./csv_file.js');
const log = require('../util/log.js');

class CsvFileBuilder {

    constructor(dirPath, suffix) {
        this.dirPath = dirPath;
        this.suffix = suffix;
    }

    build() {
        const files = [];
        
        fs.readdirSync(this.dirPath).forEach(file => {
            // ignore aggregate.csv in case this is a reupload situation
            if (file.endsWith('.csv') && file !== 'aggregate.csv') {
                let varName = file.replace('.csv', '');
                varName = varName.toLowerCase();
                varName += this.suffix;

                const filePath = path.join(this.dirPath, file);

                const csvFile = new CsvFile(filePath, varName);
                
                files.push(csvFile);
            }
        });
        
        log.debug(`Built following CSV file readers: ${files}`);
        return files;
    }
}

module.exports = CsvFileBuilder;
