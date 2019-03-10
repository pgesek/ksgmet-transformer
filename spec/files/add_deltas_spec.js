const addDeltas = require('../../src/util/add_deltas.js');

describe('Add deltas', () => {
    it('should add deltas', () => {
        const obj = {
            test_actual: 300,
            test_predicted: 400,
            other_actual: 222.38,
            other_predicted: 100,
            string: 'string',
            xx: 22
        };
        
        let expected = {};
        expected = Object.assign(expected, obj);
        expected.test_delta = '100';
        expected.other_delta = '-122.38';

        const result = addDeltas(obj);

        expect(result).toEqual(expected);
    });
});