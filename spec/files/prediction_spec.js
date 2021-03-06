const path = require('path');
const rewiremock = require('rewiremock/node');
const moment = require('moment-timezone');
const PredictionType = require('../../src/util/prediction_type.js');


describe('Prediction', () => {

    it('should properly parse the directory', () => {
        const PredictionMock = rewiremock.proxy('../../src/files/prediction.js', () => ({
            '../../src/files/modified_dates.js': class {
                getFileModDate() {
                    return moment.tz('2018-10-29 22:03:47', 'Europe/Warsaw');
                }
            }
        }));
        
        let dir;
        if (path.sep === '\\') {
            dir = 'C:\\test\\something\\ksgmet-transformer-fpama1' + 
                '\\europe_long_csv_2018_10_30.tar\\prognozy\\CSV\\' + 
                'europe_long\\2018\\10\\30\\2';
        } else {
            dir = '/tmp/ksgmet-transformer-fpama1/europe_long_csv_' + 
            '2018_10_30.tar/prognozy/CSV/europe_long/2018/10/30/2';
        }

        const prediction = new PredictionMock(dir);

        expect(prediction.predictionType).toEqual(PredictionType.EU);
        expect(prediction.year).toEqual(2018);
        expect(prediction.month).toEqual(10);
        expect(prediction.day).toEqual(30);
        expect(prediction.hour).toEqual(2);
        expect(prediction.getPredictionDate().format())
            .toEqual('2018-10-30T02:00:00+01:00');
        expect(prediction.toPath()).toEqual('europe_long_csv_2018_10_30_02');
        expect(prediction.isFuturePrediction()).toBeTruthy();
        expect(prediction.getPathInSortedBucket()).toEqual('2018_10_30_02/4h');
    });
});