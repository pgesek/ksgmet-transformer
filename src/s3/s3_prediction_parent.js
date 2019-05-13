const S3PredictionDir = require('./s3_prediction_dir');
const S3PredictionCollection = require('./s3_prediction_collection');


class S3PredictionParent {

    constructor(s3Dir) {
        this.s3Dir = s3Dir;
    }

    async listPredictionDirs() {
        const dirs = await this.s3Dir.listDirectories();

        const predDirs = dirs.map(dir => 
            new S3PredictionDir(dir, this.s3Dir.name, 
                this._parseLength(dir.name)));

        return new S3PredictionCollection(predDirs, this.s3Dir.name);
    }

    toString() {
        return this.s3Dir.path;
    }

    _parseLength(lengthStr) {
        return parseInt(lengthStr.substring(0, lengthStr.length - 1));
    }
}

module.exports = S3PredictionParent;
