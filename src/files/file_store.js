const fs = require('fs');
const log = require('../util/log.js');
const os = require('os');
const path = require('path');

const TEMP_PREFIX = 'ksgmet-transformer-';

class FileStore {

    constructor() {
        this.tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), TEMP_PREFIX));

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
}

module.exports = FileStore;
