const parseDirDate = require('../../src/util/date_util.js').parseDirDate;
const formatTarName = require('../../src/util/date_util.js').formatTarName;
const moment = require('moment-timezone');
const PredictionType = require('../../src/util/prediction_type.js');

describe('Date Utils', () => {
    it('should parse directory date', () => {
        const dirName = '2018_10_30_23_05_14';

        const parsed = parseDirDate(dirName);

        expect(parsed.format()).toEqual('2018-10-30T23:05:14+01:00');
    });

    it('should format tar name', () => {
        const date = moment.tz([2019, 1, 3, 12, 55], 'Europe/Warsaw');
        
        const tarName = formatTarName(date, PredictionType.PL);
        
        expect(tarName).toEqual('pl_csv_2019_02_03.tar.gz');
    });
});
