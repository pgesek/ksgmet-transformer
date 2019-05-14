const ReadLines = require('n-readlines');
const CsvCell = require('./csv_cell.js');

const LAST_LINE = 168;
const BROKEN_PERCIP_FILES = ['acm_convective_percip_local_max', 'acm_convective_percip_local_min'];

class CsvFile {

    constructor(filePath, varName) {
        this.filePath = filePath;
        this.varName = varName;

        this.reader = new ReadLines(filePath);
        
        this.currentRow = -1;
        this.currentCol = 0;
        this.currentLine = [];

        this.lastLineNeedsFixing = !!BROKEN_PERCIP_FILES.find(
            badFile => this.varName.startsWith(badFile));

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
        let line = this.reader.next();
        if (line) {
            let lineStr = line.toString('UTF-8');
            lineStr = lineStr.replace('\r', '');

            if (this.currentRow === LAST_LINE && this.lastLineNeedsFixing) {
                lineStr = this._fixBrokenLineInAcmConvectiveMinMax(lineStr);
            }

            if (lineStr.endsWith(',')) {
                lineStr = lineStr.substr(0, lineStr.length - 1);
            }

            this.currentLine = lineStr.split(',');
            
            this.currentCol = 0;
            this.currentRow++;
            
            return true;
        } else {
            return false;
        } 
    }

    _fixBrokenLineInAcmConvectiveMinMax(line) {
        return line.replace(/E8-9/g, 'E8,-9');
    }
}

module.exports = CsvFile;
