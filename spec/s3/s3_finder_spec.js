const S3Finder = require('../../src/s3/s3_finder.js');
const moment = require('moment-timezone');
const settings = require('../../src/util/settings.js');
const PredictionType = require('../../src/util/prediction_type.js');

describe('S3 Finder', () => {
    it('should find best matching dir', async () => {
        if (!settings.LOAD_AWS_CONFIG_FILE) {
            pending('Requires AWS Config');
            return;
        }

        const finder = new S3Finder('ksgmet');

        let date = moment.tz([2018, 9, 25, 8, 0, 49], 'Europe/Warsaw');
        let dir = await finder.findClosest(date, PredictionType.PL);

        expect(dir.path).toEqual('2018_10_25_08_00_49');
    });
});