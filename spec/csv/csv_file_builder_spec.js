const CsvFileBuilder = require('../../src/csv/csv_file_builder.js');
const path = require('path');

describe('CSV File Builder', () => {
    it('should build CSV Files', () => {
        const dirPath = 'spec/test-files/test-dir'.replace(/\//g, path.sep);
        const builder = new CsvFileBuilder(dirPath);

        const files = builder.build();

        expect(files.length).toEqual(3);
        
        const varNames = files.map(file => file.varName).sort();
        expect(varNames).toEqual(['acm_convective_percip',
            'cloud_frac', 'test_something']);
        
        const fileNames = files.map(file => file.filePath).sort();
        expect(fileNames).toEqual([
            dirPath + path.sep + 'acm_convective_percip.csv',
            dirPath + path.sep + 'cloud_frac.csv',
            dirPath + path.sep + 'test_something.csv']);
    });
});