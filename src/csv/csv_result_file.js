const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');

class CsvResultFile {
    constructor(filePath) {
        this.filePath = filePath;
        this.writeStream = fs.createWriteStream(filePath,
            { encoding: 'utf8' });
        this.headerWritten = false;
    }

    writeUnit(unit) {
        const csvStringifier = this._getCsvStringifier(unit);
        let data = ''
        if (!this.headerWritten) {
            const header = csvStringifier.getHeaderString();
            data = header;

            this.headerWritten = true;
        }

        const line = csvStringifier.stringifyRecords([unit]);
        data += line;

        return new Promise((resolve, reject) => {
            this.writeStream.write(data, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });  
        });
    }
 
    end() {
        this.writeStream.end();
    }

    _getCsvStringifier(unit) {
        if (!this.csvStringifier) {
            let keys = Object.keys(unit);
            keys = keys.sort();

            const header = keys.map(key => ({id: key, title: key}));

            this.csvStringifier = createCsvStringifier({
                header
            });
        }
        return this.csvStringifier;
    }
}

module.exports = CsvResultFile;
