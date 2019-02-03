const calcLocationDimId = require('../../src/dims/location_dim.js');
const {EU, PL} = require('../../src/util/prediction_type.js');

describe('Location dimension calculator', () => {
   
    it('should calculate EU location IDs', () => {
        // 1,0,0,True
        expect(calcLocationDimId(0, 0, EU)).toEqual(1);
        // 6941,71,53,True
        expect(calcLocationDimId(71, 53, EU)).toEqual(6941);
        // 292,3,0,True
        expect(calcLocationDimId(3, 0, EU)).toEqual(292);
        // 23911,246,48,True
        expect(calcLocationDimId(246, 48, EU)).toEqual(23911);
    });

    it('should calculate PL location IDs', () => {
        // 24445,0,0,False
        expect(calcLocationDimId(0, 0, PL)).toEqual(24445);
        // 24823,2,38,False
        expect(calcLocationDimId(2, 38, PL)).toEqual(24823);
        // 46772,131,57,False
        expect(calcLocationDimId(131, 57, PL)).toEqual(46772);
        // 79694,324,169,False
        expect(calcLocationDimId(324, 169, PL)).toEqual(79694);
    });

    it('should throw error for too incorrect EU x/y', () => {
        expect(() => calcLocationDimId(-2, 0, EU)).toThrow(
            'X of -2 is incorrect for prediction type Europe Long');
        expect(() => calcLocationDimId(252, 0, EU)).toThrow(
            'X of 252 is incorrect for prediction type Europe Long');
        expect(() => calcLocationDimId(3, -1, EU)).toThrow(
            'Y of -1 is incorrect for prediction type Europe Long');
        expect(() => calcLocationDimId(22, 99, EU)).toThrow(
            'Y of 99 is incorrect for prediction type Europe Long');
    });

    it('should throw error for too incorrect PL x/y', () => {
        expect(() => calcLocationDimId(-2, 0, PL)).toThrow(
            'X of -2 is incorrect for prediction type Poland');
        expect(() => calcLocationDimId(325, 0, PL)).toThrow(
            'X of 325 is incorrect for prediction type Poland');
        expect(() => calcLocationDimId(3, -1, PL)).toThrow(
            'Y of -1 is incorrect for prediction type Poland');
        expect(() => calcLocationDimId(22, 172, PL)).toThrow(
            'Y of 172 is incorrect for prediction type Poland');
    });
});