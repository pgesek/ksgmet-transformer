const S3Finder = require('../../src/s3/s3_finder.js');
const moment = require('moment-timezone');
const settings = require('../../src/util/settings.js');
const PredictionType = require('../../src/util/prediction_type.js');

function pendingIfAwsDisabled() {
    if (!settings.LOAD_AWS_CONFIG_FILE) {
        pending('Requires AWS Config');
        return;
    }
}

describe('S3 Finder', () => {
    
    const finder = new S3Finder('ksgmet');

    it('should find exact if available dir', async () => {
        pendingIfAwsDisabled();        

        const date = moment.tz([2018, 9, 25, 8, 0, 49], 'Europe/Warsaw');
        const dir = await finder.findClosest(date, PredictionType.PL);

        expect(dir.path).toEqual('2018_10_25_08_00_49');
    });

    it('should find best matching dir after date', async () => {
        pendingIfAwsDisabled();

        const date = moment.tz([2018, 11, 11, 05], 'Europe/Warsaw');
        const dir = await finder.findClosest(date, PredictionType.EU);

        expect(dir.path).toEqual('2018_12_11_07_00_48');
    });

    it('should find best matching dir after date with single digits', async () => {
        pendingIfAwsDisabled();

        const date = moment.tz([2019, 0, 28, 23], 'Europe/Warsaw');
        const dir = await finder.findClosest(date, PredictionType.PL);

        expect(dir.path).toEqual('2019_01_29_01_00_49');
    });

    it('should find best matching dir before date', async () => {
        pendingIfAwsDisabled();

        const date = moment.tz([2018, 10, 21, 9], 'Europe/Warsaw');
        const dir = await finder.findClosest(date, PredictionType.EU);

        expect(dir.path).toEqual('2018_11_21_07_00_49');
    });

    it('should return null for missing data', async () => {
        pendingIfAwsDisabled();

        const date = moment.tz([2018, 10, 21, 9], 'Europe/Warsaw');
        const dir = await finder.findClosest(date, PredictionType.PL);

        expect(dir).toBeNull();
    });
});