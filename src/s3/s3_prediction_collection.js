const S3PredictionDir = require('./s3_prediction_dir');

class S3PredictionCollection {

    constructor(s3Dir) {
        this.s3Dir = s3Dir;
    }

    async listPredictionDirs() {
        const dirs = await this.s3Dir.listDirectories();

        let predDirs = dirs.map(dir => 
            new S3PredictionDir(dir, this.s3Dir.name, 
                this._parseLength(dir.name)));

        return predDirs.sort((a, b) => {
            return a.predLength - b.predLength; 
        });
    }

    toString() {
        return this.s3Dir.path;
    }

    _parseLength(lengthStr) {
        return parseInt(lengthStr.substring(0, lengthStr.length - 1));

    }
}

module.exports = S3PredictionCollection;
