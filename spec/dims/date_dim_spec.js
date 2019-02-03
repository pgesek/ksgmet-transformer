const calcDateDimId = require('../../src/dims/date_dim.js');
const settings = require('../../src/util/settings.js');
const moment = require('moment-timezone');

describe('Date dimension calculator', () => {
    it('should calculate 1 for start date', () => {
        const dt = moment.tz('2018-09-01', settings.TIMEZONE);
        
        const id = calcDateDimId(dt);

        expect(id).toEqual(1);
    });

    it('should calculate id independent of hour', () => {
        const dt = moment.tz('2018-09-03T23:59:59', settings.TIMEZONE);
        
        const id = calcDateDimId(dt);

        expect(id).toEqual(3);
    });

    it('should calculate ids for dates', () => {
        let dt = moment.tz('2019-01-27', settings.TIMEZONE);
        let id = calcDateDimId(dt);
        expect(id).toEqual(149);

        dt = moment.tz('2019-07-31', settings.TIMEZONE);
        id = calcDateDimId(dt);
        expect(id).toEqual(334);

        dt = moment.tz('2018-10-22', settings.TIMEZONE);
        id = calcDateDimId(dt);
        expect(id).toEqual(52);
    });

    it('should throw exception for too old dates', () => {
        const dt = moment.tz('2018-08-31', settings.TIMEZONE);

        expect(() => calcDateDimId(dt)).toThrow('Date is too old: ' + dt.format());
    });
});