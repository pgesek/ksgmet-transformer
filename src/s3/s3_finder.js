const S3Directory = require('./s3_directory.js');
const settings = require('../util/settings.js');

class S3Finder {

    constructor(bucketName) {
        this.bucketName = bucketName;
    }

    async findClosest(momentDate) {
        const root = new S3Directory(this.bucketName, '/')
        const dirs = await root.listFiles();
    }
}