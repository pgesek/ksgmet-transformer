const fs = require('fs');
const path = require('path');
const log = require('../util/log.js');

class S3File {
    constructor(fileName, path, bucketName, s3ref) {
        this.fileName = fileName;
        this.path = path;
        this.bucketName = bucketName;
        this.s3ref = s3ref;
    }

    async fetch(store) {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}/${this.fileName}`
        }

        return new Promise((resolve, reject) => {
            this.s3ref.getObject(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                store.saveFile(this.fileName, data.Body)
                    .then(filePath => {
                        this.filePath = filePath;
                        resolve(filePath);
                    }).catch(err => reject(err));
            });
        });
    }

    toString() {
        return `${this.bucketName}: ${this.path}/${this.fileName}`;
    }

    fileNameNoExt() {
        return this.fileName.replace(/\.[^/.]+$/, '');
    }
}

module.exports = S3File;
