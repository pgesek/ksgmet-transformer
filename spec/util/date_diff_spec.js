const { dateDiffHours, dateDiffMinutes } = require('../../src/util/date_diff.js');
const moment = require('moment-timezone');

describe('Date diff', () => {
    it('should calculate minute date differences', () => {
        const start = moment.tz('2019-01-13 17:00',
            'Europe/Warsaw');
        const end = moment.tz('2019-01-15 13:45',
            'Europe/Warsaw');

        let delta = dateDiffMinutes(start, end);
        expect(delta).toEqual(2685);
        
        delta = dateDiffMinutes(end, start);
        expect(delta).toEqual(-2685);
    });

    it('should calculate hour date differences', () => {
        const start = moment.tz('2019-01-13 17:00',
            'Europe/Warsaw');
        const end = moment.tz('2019-01-15 13:45',
            'Europe/Warsaw');

        let delta = dateDiffHours(start, end);
        expect(delta).toEqual(45);
        
        delta = dateDiffHours(end, start);
        expect(delta).toEqual(-44);
    });
});
