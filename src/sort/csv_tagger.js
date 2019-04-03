const path = require('path');

function tagCsvFiles(prediction) {
    const files = prediction.listCsvFiles();

    return files.map(file => ({
        filePath: path.join(prediction.dirPath, file),
        name: path.basename(file),
        madeOn: prediction.getModDate(path.basename(file)),
        predictionDate: prediction.getPredictionDate(),
        storageClass: 'STANDARD_IA',
        prefix: prediction.getPathInSortedBucket(path.basename(file))
    }));
}

module.exports = tagCsvFiles;
