const ModifiedDates = require('../../src/files/modified_dates.js');

describe('Modified Dates', () => {
    it('should read modified dates for files', () => {
        const modDates = new ModifiedDates('spec/test-files/modified_dates.json');
        
        expect(modDates.getFileModDate('DOMAIN_PERCIP_TYPE_S.csv'))
            .toEqual(new Date(Date.UTC(2018, 9, 24, 17, 50, 48)));
            expect(modDates.getFileModDate('SHELTER_DEWPOINT.csv'))
            .toEqual(new Date(Date.UTC(2018, 9, 24, 17, 50, 48)));
    });
});