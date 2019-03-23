const del = require('del');
const fs = require('fs');
const moment = require('moment-timezone');
const os = require('os');
const path = require('path');
const PredictionParser = require('../../src/csv/prediction_parser');
const PredictionType = require('../../src/util/prediction_type');

describe('Prediction Parser', () => {
    let tmpDir;

    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'prediction_parser_test'));
    });
    
    afterAll(async () => {
        //await del([tmpDir], { force: true});
    });

    it('should parse predictions', async () => {
        const prediction = {
            dirPath: 'spec/test-files/parser-test/data/prediction',
            getPredictionDate: () => moment.tz('2018-10-29 11:00:00', 'Europe/Warsaw'),
            getMadeOnDate: () => moment.tz('2018-10-28 10:24:27', 'Europe/Warsaw'),
            predictionType: PredictionType.EU 
        };
        const actual = {
            dirPath: 'spec/test-files/parser-test/data/actual',
            getPredictionDate: () => moment.tz('2018-10-29 11:00:00', 'Europe/Warsaw'),
            getMadeOnDate: () => moment.tz('2018-10-29 10:33:12', 'Europe/Warsaw'),
            predictionType: PredictionType.EU,
            getMinuteDiff: () => 10
        };

        const predictionParser = new PredictionParser(prediction, actual, tmpDir);
        await predictionParser.parsePredictionUnits();

        const expectedFile = path.join(tmpDir, 'prediction_25h_on_2018_10_28_10_24_'
            + 'for_2018_10_29_11_eu.csv');
        expect(fs.existsSync(expectedFile)).toBeTruthy();
        
        const expectedContent = fs.readFileSync('spec/test-files/parser-test/expected.csv')
            .toString().replace(/\r/g, '');
        const content = fs.readFileSync(expectedFile)
            .toString().replace(/\r/g, '');
        expect(content).toEqual(expectedContent);
    });
});
