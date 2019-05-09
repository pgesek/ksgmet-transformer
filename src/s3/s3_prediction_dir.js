const Prediction = require('../files/prediction');


class S3PredictionDir {
    
    constructor(s3Dir, predDate, predLength) {
        this.s3Dir = s3Dir;
        this.predDate = predDate;
        this.predLength = predLength;
    }

    async download(store) {
        const files = this.s3Dir.listFiles();

        const tmpDirPrefix = this.predDate + '_' + this.predLength;

        await Promise.all(files.map(file =>
            file.fetch(store, tmpDirPrefix)));

        const fullPath = store.getFullTmpDirForPrefix(tmpDirPrefix);

        return new Prediction(fullPath);
    }

    toString() {
        return this.s3Dir.path;
    }
}

module.exports = S3PredictionDir;