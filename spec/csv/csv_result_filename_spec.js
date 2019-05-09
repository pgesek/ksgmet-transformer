const moment = require('moment-timezone');
const path = require('path');
const csvResultFilename = require('../../src/csv/csv_result_filename.js');

describe('CSV Result Filename', () => {
    it('should build filename for csv results', () => {
        const dirPath = 'test';

        const name = csvResultFilename(dirPath);

        expect(name).toEqual('test' + path.sep + 
            'aggregate.csv');
    });
});