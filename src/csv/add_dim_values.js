const calcDateDimId = require('../dims/date_dim.js');
const calcTimeDimId = require('../dims/time_dim.js');
const calcLocDimId = require('../dims/location_dim.js');
const calcTypeDimId = require('../dims/type_dim.js');
const dateDiffHours = require('../util/date_diff.js').dateDiffHours;

function addDimValues(unit, params) {
    const { predictionType, madeOnDt, predictionDt } =  
        params;
    
    const result = { ...unit };

    result.prediction_type = predictionType.toString();
    result.prediction_timestamp = predictionDt.format();
    result.made_on_timestamp = madeOnDt.format();

    result.prediction_date = calcDateDimId(predictionDt);
    result.prediction_time = calcTimeDimId(predictionDt.hour(),
        predictionDt.minute());

    result.made_on_date = calcDateDimId(madeOnDt);
    result.made_on_time = calcTimeDimId(madeOnDt.hour(),
        madeOnDt.minute());

    result.location = calcLocDimId(unit.x, unit.y, predictionType);
    
    const hourDiff = dateDiffHours(madeOnDt, predictionDt);
    result.type = calcTypeDimId(hourDiff, predictionType);

    return result;
}

module.exports = addDimValues;
