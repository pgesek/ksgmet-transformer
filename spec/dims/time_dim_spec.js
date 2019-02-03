const calcTimeDimId = require('../../src/dims/time_dim.js');

describe('Time dimension calculator', () => {
    it('should calculate time dim IDs', () => {
        // 1,0,0
        expect(calcTimeDimId(0, 0)).toEqual(1);
        // 37,0,36
        expect(calcTimeDimId(0, 36)).toEqual(37);
        // 992,16,31
        expect(calcTimeDimId(16, 31)).toEqual(992);
        // 1394,23,13
        expect(calcTimeDimId(23, 13)).toEqual(1394);
    });

    it('should throw errors on invalid hours or minutes', () => {
        expect(() => calcTimeDimId(-1, 23)).toThrow('Invalid hour: -1');
        expect(() => calcTimeDimId(24, 23)).toThrow('Invalid hour: 24');
        expect(() => calcTimeDimId(3, -1)).toThrow('Invalid minutes: -1');
        expect(() => calcTimeDimId(5, 60)).toThrow('Invalid minutes: 60');
    });
});