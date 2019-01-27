const dateDiff = require('../../src/util/date_diff.js');
const moment = require('moment-timezone');

describe('Date diff', () => {
    it('should calculate date differences', () => {
        const start = moment.tz('2019-01-13 17:00',
            'Europe/Warsaw');
        const end = moment.tz('2019-01-15 13:45',
            'Europe/Warsaw');

        let delta = dateDiff(start, end);
        expect(delta).toEqual(2685);
        
        delta = dateDiff(end, start);
        expect(delta).toEqual(-2685);
    });
});
