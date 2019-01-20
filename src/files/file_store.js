const fs = require('fs');
const log = require('../util/log.js');
const os = require('os');
const path = require('path');
const targz = require('targz');
const PredictionDir = require('./prediction_dir');

const TEMP_PREFIX = 'ksgmet-transformer-';

class FileStore {

    constructor() {
        this.tmpDir = this._tmpDir();
        log.info('Store constructed. Tmp directory: ' +
            this.tmpDir);
    }

    saveFile(name, body) {
        const fullPath = path.join(this.tmpDir, name);

        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, body, err => {
                if (err) {
                    reject(err);
                    return;
                }
    
                log.info('Saved file: ' + fullPath);
    
                resolve(fullPath);
            });
        });
    }

    untar(s3File) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.tmpDir, 
                s3File.fileNameNoExt());
            targz.decompress({
                src: s3File.filePath,
                dest: filePath
            }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new PredictionDir(filePath));
                }
            });
        });
    }

    _tmpDir() {
        return fs.mkdtempSync(path.join(
            os.tmpdir(), TEMP_PREFIX));
    }
}

module.exports = FileStore;
