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
    } 
});

module.exports = PredictionType;
