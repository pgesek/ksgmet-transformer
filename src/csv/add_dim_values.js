const calcDateDimId = require('../dims/date_dim.js');
const calcTimeDimId = require('../dims/time_dim.js');
const calcLocDimId = require('../dims/location_dim.js');
const calcTypeDimId = require('../dims/type_dim.js');

function addDimValues(unit, params) {
    const { predictionType, predictionDt, predLength } =  
        params;
    
    const result = { ...unit };

    result.prediction_type = predictionType.toString();
    result.prediction_timestamp = predictionDt.format();

    result.prediction_date = calcDateDimId(predictionDt);
    result.prediction_time = calcTimeDimId(predictionDt.hour(),
        predictionDt.minute());

    result.location = calcLocDimId(unit.x, unit.y, predictionType);
    
    result.prediction_length = predLength;
    result.type = calcTypeDimId(predLength, predictionType);

    return result;
}

module.exports = addDimValues;
