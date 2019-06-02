class S3PredictionCollection {
    
    constructor(predDirs, date) {
        this.predDirs = predDirs.sort((a, b) => {
            return a.predLength - b.predLength; 
        });
        this.date = date;
    }

    hasActual(threshold, index = 0) {
        return this.predDirs.length > index &&
            this.predDirs[index].predLength <= threshold;
    }

    getActual(threshold, index = 0) {
        return this.hasActual(threshold, index) ? this.predDirs[index] : null;
    }

    getPredsWeCanVerify(threshold) {
        const actual = this.getActual(threshold);
        if (actual) {
            return this.predDirs.filter(dir => dir.predLength > 0 &&
                dir.predLength > actual.predLength);
        } else {
            return [];
        }
    }
}

module.exports = S3PredictionCollection;
