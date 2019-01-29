const AWS = require('aws-sdk');
const log = require('../util/log.js');
const S3File = require('./s3_file.js');

const s3 = new AWS.S3();

class S3Directory{
    constructor(bucketName, path) {
        this.bucketName = bucketName;
        this.path = path;
    }

    listFiles() {
        log.info(`Listing files in ${this.bucketName}, path: ${this.path}`);

        const params = {
            Bucket: this.bucketName,
            Prefix: this.path
        };

        return new Promise((resolve, reject) => {
            s3.listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                let fileNames = [];
                if (data.Contents) {
                    fileNames = data.Contents.map(obj => {
                        const fromIndex = obj.Key.lastIndexOf('/') + 1;
                        const name = obj.Key.substr(fromIndex);

                        return new S3File(name, 
                            this.path, 
                            this.bucketName,
                            s3);
                    });
                }

                log.info(`Contents of ${this.path}: ${fileNames}`);

                resolve(fileNames);
            });
        });
    }

    listDirectories() {
        log.info(`Listing directories in ${this.bucketName}, path: ${this.path}`);

        const params = {
            Bucket: this.bucketName,
            Prefix: this.path,
            Delimiter: '/'
        };

        return new Promise((resolve, reject) => {
            s3.listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                let dirNames = [];
                if (data.CommonPrefixes) {
                    dirNames = data.CommonPrefixes.map(prefix => {
                        let name = prefix.Prefix;
                        name = name.substr(0, name.lastIndexOf('/'));
                        return new S3Directory(this.bucketName, name);
                    });
                }

                log.info(`Found ${dirNames.length} directories in ${this.path}`);

                resolve(dirNames);
            });
        });
    }

    getFileHandle(filename) {
        return new S3File(filename, this.path, this.bucketName, s3);
    }
}

module.exports = S3Directory;
