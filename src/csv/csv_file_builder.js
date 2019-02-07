const fs = require('fs');
const path = require('path');
const CsvFile = require('./csv_file.js');
const log = require('../util/log.js');

class CsvFileBuilder {

    constructor(dirPath) {
        this.dirPath = dirPath;
    }

    build() {
        const files = [];
        
        fs.readdirSync(this.dirPath).forEach(file => {
            if (file.endsWith('.csv')) {
                let varName = file.replace('.csv', '');
                varName = varName.toLowerCase();

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
