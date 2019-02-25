const PredictionType = Object.freeze({
    PL: {
        DIR_PATH: 'poland',
        TAR_PREFIX: 'pl_csv',
        RESULT_SUFFIX: 'pl',
        MAX_LOCATION_X: 324,
        MAX_LOCATION_Y: 169,
        MAX_PREDICTION_LENGTH: 47,
        isPl: () => true,
        isEu: () => false,
        toString: () => 'Poland'
    },
    EU: {
        DIR_PATH: 'europe_long',
        TAR_PREFIX: 'europe_long_csv',
        RESULT_SUFFIX: 'eu',
        MAX_LOCATION_X: 251,
        MAX_LOCATION_Y: 96,
        MAX_PREDICTION_LENGTH: 167,
        isPl: () => false,
        isEu: () => true,
        toString: () => 'Europe Long'
    },
    fromString: (str) => {
        if (str === PredictionType.PL.DIR_PATH) {
            return PredictionType.PL;
        } else if (str === PredictionType.EU.DIR_PATH) {
            return PredictionType.EU;
        } else {
            throw 'Prediction must be either EU or PL. Invalid dir: ' +
                this.dirPath;
        }
    },
    isPredictionTar(fileName) {
        return fileName.startsWith(this.PL.TAR_PREFIX) ||
            fileName.startsWith(this.EU.TAR_PREFIX);
    }
});

module.exports = PredictionType;
