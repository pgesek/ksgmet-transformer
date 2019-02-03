const calculateTypeDimId = require('../../src/dims/type_dim.js');
const { EU, PL } = require('../../src/util/prediction_type.js');

describe('Type dimension ID calculator', () => {
    it('should calculate IDs for PL predictions', () => {
        // 169,False,0
        expect(calculateTypeDimId(0, PL)).toEqual(169);
        // 184,False,15
        expect(calculateTypeDimId(15, PL)).toEqual(184);
        // 198,False,29
        expect(calculateTypeDimId(29, PL)).toEqual(198);
        // 216,False,47
        expect(calculateTypeDimId(47, PL)).toEqual(216);
    });

    it('should calculate IDs for EU predictions', () => {
        // 1,True,0
        expect(calculateTypeDimId(0, EU)).toEqual(1);
        // 17,True,16
        expect(calculateTypeDimId(16, EU)).toEqual(17);
        // 73,True,72
        expect(calculateTypeDimId(72, EU)).toEqual(73);
        // 168,True,167
        expect(calculateTypeDimId(167, EU)).toEqual(168);
    });

    it('should throw errors on invalid PL prediction length', () => {
        expect(() => calculateTypeDimId(-1, PL)).toThrow(
            'Invalid prediction length -1 for prediction type Poland');
        expect(() => calculateTypeDimId(48, PL)).toThrow(
            'Invalid prediction length 48 for prediction type Poland');
    });

    it('should throw errors on invalid EU prediction length', () => {
        expect(() => calculateTypeDimId(-1, EU)).toThrow(
            'Invalid prediction length -1 for prediction type Europe Long');
        expect(() => calculateTypeDimId(168, EU)).toThrow(
            'Invalid prediction length 168 for prediction type Europe Long');
    });
});