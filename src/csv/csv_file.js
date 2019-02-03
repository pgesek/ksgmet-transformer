const ReadLines = require('n-readlines');
const CsvCell = require('./csv_cell.js');

class CsvFile {

    constructor(filePath) {
        this.filePath = filePath;
        this.reader = new ReadLines(filePath);
        
        this.currentRow = -1;
        this.currentCol = 0;
        this.currentLine = [];
    }

    nextCell() {
        if (this.currentLine.length === 0) {
            const success = this._readNextLine();
            if (!success) {
                return null;
            }
        }

        const val = this.currentLine.shift();
        const cell = new CsvCell(val, this.currentCol,
            this.currentRow);

        this.currentCol++;

        return cell;
    }

    _readNextLine() {
        const line = this.reader.next();
        if (line) {
            let lineStr = line.toString('UTF-8');
            lineStr = lineStr.replace('\r', '');

            this.currentLine = lineStr.split(',');
            
            this.currentCol = 0;
            this.currentRow++;
            
            return true;
        } else {
            return false;
        } 
    }
}

module.exports = CsvFile;
