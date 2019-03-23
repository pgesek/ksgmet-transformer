const moment = require('moment-timezone');
const path = require('path');
const csvResultFilename = require('../../src/csv/csv_result_filename.js');
const PredictionType = require('../../src/util/prediction_type');

describe('CSV Result Filename', () => {
    it('should build filename for csv results', () => {
        const dirPath = 'test';
        const predictionDt = moment.tz('2018-09-11 17:45', 
            'Europe/Warsaw');
        const predictionForDt = moment.tz('2018-10-02 02:03', 
            'Europe/Warsaw');

        const name = csvResultFilename(dirPath, predictionDt,
            predictionForDt, PredictionType.PL);

        expect(name).toEqual('test' + path.sep + 
            'prediction_489h_on_2018_09_11_17_45' +
            '_for_2018_10_02_02_pl.csv');
    });
});