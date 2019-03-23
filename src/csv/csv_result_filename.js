
const path = require('path');
const dateDiffHours = require('../util/date_diff').dateDiffHours;


const DATE_FORMAT_ON = 'YYYY_MM_DD_HH_mm';
const DATE_FORMAT_FOR = 'YYYY_MM_DD_HH';

function csvResultFilename(dirPath, predictionMoment,
    predictionForMoment, predictionType) {
 
    const hourDiff = dateDiffHours(predictionMoment, 
        predictionForMoment);
        
    const fileName = `prediction_${hourDiff}h_on_${predictionMoment.format(DATE_FORMAT_ON)}_`
        + `for_${predictionForMoment.format(DATE_FORMAT_FOR)}_`
        + `${predictionType.RESULT_SUFFIX}.csv`;

    return path.join(dirPath, fileName);
}

module.exports = csvResultFilename;
