const addDimValues = require('../../src/csv/add_dim_values.js');
const PredictionType = require('../../src/util/prediction_type.js');
const moment = require('moment-timezone');

describe('Add dim values', () => {
    it('should add dim values', () => {
        const unit = {
            val: 4.23,
            val2: 2,
            x: 22,
            y: 31
        };
        const params = {
            predictionType: PredictionType.PL,
            predictionDt: moment.tz('2018-11-20 17:00', 'Europe/Warsaw'),
            predLength: 9
        };
        const expected = {
            val: 4.23,
            val2: 2,

            prediction_type: 'Poland',
            x: 22,
            y: 31,
            prediction_timestamp: params.predictionDt.format(),

            prediction_date: 81,
            prediction_time: 1021,
            location: 28216,
            type: 178,
            prediction_length: 9
        }

        const result = addDimValues(unit, params);

        expect(result).toEqual(expected);
    });
});