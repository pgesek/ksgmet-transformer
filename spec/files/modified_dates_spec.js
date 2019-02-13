const moment = require('moment-timezone');
const ModifiedDates = require('../../src/files/modified_dates.js');

describe('Modified Dates', () => {
    it('should read modified dates for files', () => {
        const modDates = new ModifiedDates('spec/test-files/modified_dates.json');
        
        expect(modDates.getFileModDate('DOMAIN_PERCIP_TYPE_S.csv').format())
            .toEqual(moment.tz('2018-10-24 19:50:48', 'Europe/Warsaw').format());
        expect(modDates.getFileModDate('SHELTER_DEWPOINT.csv').format())
            .toEqual(moment.tz('2018-10-24 19:50:48', 'Europe/Warsaw').format());
    });
});