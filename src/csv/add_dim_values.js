const calcDateDimId = require('../dims/date_dim.js');
const calcTimeDimId = require('../dims/time_dim.js');
const calcLocDimId = require('../dims/location_dim.js');
const calcTypeDimId = require('../dims/type_dim.js');
const dateDiffHours = require('../util/date_diff.js').dateDiffHours;

function addDimValues(unit, params) {
    const { predictionType, x, y, predictionDt, predictedForDt } =  
        params;
    
    const result = {};
    Object.assign(result, unit);

    result.prediction_type = predictionType.toString();
    result.x = x;
    result.y = y;
    result.prediction_dt = predictionDt.format();
    result.made_on_dt = predictedForDt.format();

    result.prediction_date = calcDateDimId(predictedForDt);
    result.prediction_time = calcTimeDimId(predictedForDt.hour(),
        predictedForDt.minute());

    result.made_on_date = calcDateDimId(predictionDt);
    result.made_on_time = calcTimeDimId(predictionDt.hour(),
        predictionDt.minute());

    result.location = calcLocDimId(x, y, predictionType);
    
    const hourDiff = dateDiffHours(predictionDt, predictedForDt);
    result.type = calcTypeDimId(hourDiff, predictionType);

    return result;
}

module.exports = addDimValues;
