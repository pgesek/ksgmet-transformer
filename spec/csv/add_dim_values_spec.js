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

            madeOnDt: moment.tz('2018-11-20 08:22:11', 'Europe/Warsaw'),
            predictionDt: moment.tz('2018-11-20 17:00', 'Europe/Warsaw')
        };
        const expected = {
            val: 4.23,
            val2: 2,

            prediction_type: 'Poland',
            x: 22,
            y: 31,
            prediction_timestamp: params.predictionDt.format(),
            made_on_timestamp: params.madeOnDt.format(),

            prediction_date: 81,
            prediction_time: 1021,
            made_on_date: 81,
            made_on_time: 503,
            location: 28216,
            type: 178
        }

        const result = addDimValues(unit, params);

        expect(result).toEqual(expected);
    });
});