const fs = require('fs');
const s3 = require('./s3_ref');
const util = require('util');

class S3File {
    constructor(fileName, path, bucketName) {
        this.fileName = fileName;
        this.path = path;
        this.bucketName = bucketName;
    }

    async fetch(store, dirPrefix) {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}/${this.fileName}`
        }

        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                store.saveFile(this.fileName, data.Body, dirPrefix)
                    .then(filePath => {
                        this.filePath = filePath;
                        resolve(filePath);
                    }).catch(err => reject(err));
            });
        });
    }

    async copyTo(targetBucket, targetPath, newName) {
        const params = {
            Bucket: targetBucket,
            CopySource: `/${this.bucketName}/${this.path}/${this.fileName}`,
            Key: `${targetPath}/${newName}`
        };
        
        let s3copyPromisified = util.promisify(s3.copyObject);
        s3copyPromisified = s3copyPromisified.bind(s3);

        await s3copyPromisified(params);
    }

    toString() {
        return `${this.bucketName}: ${this.path}/${this.fileName}`;
    }

    fileNameNoExt() {
        return this.fileName.replace(/\.[^/.]+$/, '');
    }

    expandedFileNameNoExt() {
        return this.fileNameNoExt() + '_from_' + this.path;
    }

    rmLocalFile() {
        return new Promise((resolve, reject) => {
            if (this.filePath) {
                fs.unlink(this.filePath, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }
}

module.exports = S3File;
