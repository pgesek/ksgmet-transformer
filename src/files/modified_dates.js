const fs = require('fs');

class ModifiedDates {

    constructor(filePath) {
        this.filePath = filePath;

        this.dates = JSON.parse(fs.readFileSync(
            this.filePath, 'utf8'));
    }

    getFileModDate(file) {
        return new Date(this.dates[file]);
    }
}

module.exports = ModifiedDates;
