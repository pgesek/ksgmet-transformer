const path = require('path');
const rewiremock = require('rewiremock/node')

describe('Prediction', () => {

    it('should properly parse the directory', () => {
        const PredictionMock = rewiremock.proxy('../../src/files/prediction.js', () => ({
            '../../src/files/modified_dates.js': class {}
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

        expect(prediction.isEu).toBeTruthy();
        expect(prediction.isPl).toBeFalsy();
        expect(prediction.year).toEqual(2018);
        expect(prediction.month).toEqual(10);
        expect(prediction.day).toEqual(30);
        expect(prediction.hour).toEqual(2);
        expect(prediction.getPredictionDate().format())
            .toEqual('2018-10-30T02:00:00+01:00');
    });
});