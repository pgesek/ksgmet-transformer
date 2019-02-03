const EU_TYPE = require('../util/prediction_type.js').EU;

function calculateTypeDimId(hoursAhead, predictionType) {
    if (hoursAhead < 0 ||
        hoursAhead > predictionType.MAX_PREDICTION_LENGTH) {
        throw `Invalid prediction length ${hoursAhead} ` +
            `for prediction type ${predictionType.toString()}`;
    }

    let start = 1;
    if (predictionType.isPl()) {
        start += calculateTypeDimId(EU_TYPE.MAX_PREDICTION_LENGTH,
            EU_TYPE);
    }

    return start + hoursAhead;
}

module.exports = calculateTypeDimId;
