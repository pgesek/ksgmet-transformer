const PredictionType = Object.freeze({
    PL: {
        DIR_PATH: 'poland',
        TAR_PREFIX: 'pl_csv',
        isPl: () => true,
        isEu: () => false
    },
    EU: {
        DIR_PATH: 'europe_long',
        TAR_PREFIX: 'europe_long_csv',
        isPl: () => false,
        isEu: () => true
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
    }
});

module.exports = PredictionType;
