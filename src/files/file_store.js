const del = require('del');
const fs = require('fs');
const fsExtra = require('fs-extra');
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

    saveFile(name, body, prefix) {
        let fullPath = prefix ? path.join(this.tmpDir, prefix) : this.tmpDir;
        if (!fs.existsSync(fullPath)) {
            fsExtra.mkdirpSync(fullPath);
        }
        
        fullPath = path.join(fullPath, name);

        log.info(`Saving ${name} to ${fullPath}`);

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

    untar(prefix, s3File) {
        const dirPath = path.join(this.tmpDir, prefix);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        log.info(`Untaring ${s3File.fileName} to ${dirPath}`);

        return new Promise((resolve, reject) => {
            const filePath = path.join(dirPath, 
                s3File.expandedFileNameNoExt());
            targz.decompress({
                src: s3File.filePath,
                dest: filePath
            }, err => {
                if (err) {
                    reject(err);
                } else {
                    log.info(`Untarred ${s3File.fileName} to ${dirPath}`);
                    resolve(new PredictionDir(filePath));
                }
            });
        });
    }

    buildResultDir(suffix) {
        return new Promise((resolve, reject) => {
            const resultDirPath = path.join(this.tmpDir, suffix);
            log.info('Creating result directory: ' + resultDirPath);
            fs.mkdir(resultDirPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    log.info('Created result directory: ' + resultDirPath);
                    resolve(resultDirPath);
                }
            });
        });
    }

    async rmDir(dirPath) {
        if (dirPath) {
            log.info('Cleaning result dir: ' + dirPath);
            await del(dirPath, { force: true });
        } else {
            log.warn('Cannot clean result dir, it does not exist');
        }
    }

    async rmTmpDir(dirPath) {
        const fullPath = path.join(this.tmpDir, dirPath);
        if (dirPath) {
            log.info('Cleaning result dir: ' + fullPath);
            await del(fullPath, { force: true });
        } else {
            log.warn('Cannot clean result dir, it does not exist');
        }
    }

    getFullTmpDirForPrefix(prefix) {
        return path.join(this.tmpDir, prefix);
    }

    _tmpDir() {
        return fs.mkdtempSync(path.join(
            os.tmpdir(), TEMP_PREFIX));
    }
}

module.exports = FileStore;
