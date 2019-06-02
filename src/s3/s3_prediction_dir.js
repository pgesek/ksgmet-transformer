const PredictionV2 = require('../files/prediction_v2');
const PredictionType = require('../util/prediction_type');


class S3PredictionDir {
    
    constructor(s3Dir, predDate, predLength) {
        this.s3Dir = s3Dir;
        this.predDate = predDate;
        this.predLength = predLength;
    }

    async download(store) {
        const files = await this.s3Dir.listFiles();

        const tmpDirPrefix = this.predDate + '_' + this.predLength;

        await Promise.all(files.map(async file =>
            await file.fetch(store, tmpDirPrefix)));

        const fullPath = store.getFullTmpDirForPrefix(tmpDirPrefix);

        return new PredictionV2(fullPath, this.predLength, this.predDate,
            PredictionType.PL);
    }

    async isBad() {
        const files = await this.s3Dir.listFiles();
        return files.length < 31;
    }

    toString() {
        return this.s3Dir.path;
    }
}

module.exports = S3PredictionDir;