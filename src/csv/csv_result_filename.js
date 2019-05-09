
const path = require('path');


function csvResultFilename(dirPath) {
    return path.join(dirPath, 'aggregate.csv');
}

module.exports = csvResultFilename;
