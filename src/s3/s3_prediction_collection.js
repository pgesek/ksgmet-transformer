class S3PredictionCollection {
    
    constructor(predDirs, date) {
        this.predDirs = predDirs.sort((a, b) => {
            return a.predLength - b.predLength; 
        });
        this.date = date;
    }

    hasActual(threshold) {
        return this.predDirs.length > 0 && 
            this.predDirs[0].predLength <= threshold;
    }

    getActual(threshold) {
        return this.hasActual(threshold) ? this.predDirs[0] : null;
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
