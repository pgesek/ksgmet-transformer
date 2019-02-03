const EU_TYPE = require('../util/prediction_type.js').EU;

function calcLocationDimId(x, y, predictionType) {
    if (x > predictionType.MAX_LOCATION_X || x < 0) {
        throw `X of ${x} is incorrect for prediction ` + 
            `type ${predictionType.toString()}`;
    }
    if (y > predictionType.MAX_LOCATION_Y || y < 0) {
        throw `Y of ${y} is incorrect for prediction ` + 
            `type ${predictionType.toString()}`;
    }

    let startsAt = 1;
    if (predictionType.isPl()) {
        startsAt += calcLocationDimId(EU_TYPE.MAX_LOCATION_X, 
            EU_TYPE.MAX_LOCATION_Y, EU_TYPE);
    } 

    return (x * (predictionType.MAX_LOCATION_Y + 1)) 
        + startsAt + y;
}

module.exports = calcLocationDimId;
