const del = require('del');
const fs = require('fs');
const os = require('os');
const path = require('path');
const CsvResultFile = require('../../src/csv/csv_result_file.js');

describe('CSV Result File', () => {

    let tmpDir;

    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'csv_result_file_test'));
    });

    afterAll(async () => {
        await del([tmpDir], { force: true});
    });

    it('should write results', async () => {
        const filePath = path.join(tmpDir, 'out.csv');
        const resultFile = new CsvResultFile(filePath);

        await resultFile.writeUnit({ acm_convective_percip: 44.77, fsi: 1.0, 
            lifted_index: 30.2 });
        await resultFile.writeUnit({ acm_convective_percip: 56.27, fsi: 3.0, 
            lifted_index: 30.2 });
        await resultFile.writeUnit({ acm_convective_percip: 11.1237, fsi: 21, 
            lifted_index: 23.0 });

        resultFile.end();

        const result = fs.readFileSync(filePath, { encoding: 'utf8'});

        const expectedResult = 'acm_convective_percip,fsi,lifted_index\n' +
            '44.77,1,30.2\n56.27,3,30.2\n11.1237,21,23\n';
        expect(result).toEqual(expectedResult);
    });
});