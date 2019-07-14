const dateMatches = require('../../src/db/find_aggregate_dirs').dateMatches;
const moment = require('moment-timezone');

describe('Find Aggregate Dirs', () => {
    it('should correctly match dates', () => {
        const date = moment.tz('2018-11-20 17:00', 'Europe/Warsaw');

        
        expect(dateMatches(date, '2018-11-20', '2019-01-01')).toBeTruthy();
        expect(dateMatches(date, '2018-07-08', '2018-11-20')).toBeTruthy();
        expect(dateMatches(date, '2018-07-08', '2019-10-10')).toBeTruthy();
        
        expect(dateMatches(date, '2018-07-08', '2018-10-10')).toBeFalsy();
        expect(dateMatches(date, '2018-11-23', '2019-02-16')).toBeFalsy();
    });
});
