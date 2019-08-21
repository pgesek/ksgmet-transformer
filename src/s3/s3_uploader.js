const AWS = require('aws-sdk');
const fs = require('fs');
const log = require('../util/log.js');
const path = require('path');

const s3 = new AWS.S3();

class S3Uploader {

    constructor(bucketName, prefix) {
        this.bucketName = bucketName;
        this.prefix = prefix;
    }

    uploadFile(file) {
        const filePath = file.filePath;
        const storageClass = file.storageClass || 'STANDARD';
        
        let metadata = null;
        if (file.madeOn && file.predictionDate) {
            metadata = {
                madeOn: file.madeOn.format(),
                predictionDate: file.predictionDate.format()
            }
        }

        log.info(`Uploading ${filePath} to ${this.bucketName}`);

        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);

        let key = this.prefix;
        if (file.prefix) {
            key += `/${file.prefix}`;
        }
        key += `/${fileName}`;

        const params = {
            Body: fileStream,
            Bucket: this.bucketName,
            Key: key,
            StorageClass: storageClass,
            Metadata: metadata
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                log.info(`Successfully uploaded ${fileName} to ${data.Location}`);

                resolve(data.Location);
            });
        });
    }
}

module.exports = S3Uploader;
