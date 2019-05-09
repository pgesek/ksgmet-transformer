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
        await del([tmpDir], { force: true});
    });

    it('should parse predictions', async () => {
        const prediction = {
            dirPath: 'spec/test-files/parser-test/data/prediction',
            getPredictionDate: () => moment.tz('2018-10-29 11:00:00', 'Europe/Warsaw'),
            predType: PredictionType.EU,
            predLength: 25
        };
        const actual = {
            dirPath: 'spec/test-files/parser-test/data/actual',
            getPredictionDate: () => moment.tz('2018-10-29 11:00:00', 'Europe/Warsaw'),
            getMadeOnDate: () => moment.tz('2018-10-29 10:33:12', 'Europe/Warsaw'),
            predType: PredictionType.EU,
            predLength: -1
        };

        const predictionParser = new PredictionParser(prediction, actual, tmpDir);
        await predictionParser.parsePredictionUnits();

        const expectedFile = path.join(tmpDir, 'aggregate.csv');
        expect(fs.existsSync(expectedFile)).toBeTruthy();
        
        const expectedContent = fs.readFileSync('spec/test-files/parser-test/expected.csv')
            .toString().replace(/\r/g, '');
        const content = fs.readFileSync(expectedFile)
            .toString().replace(/\r/g, '');
        expect(content).toEqual(expectedContent);
    });
});
