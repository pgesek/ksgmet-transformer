const log = require('../util/log.js');
const S3File = require('./s3_file.js');
const s3 = require('./s3_ref');

class S3Directory {
    constructor(bucketName, name, prefix) {
        this.bucketName = bucketName;
        this.name = name;
        this.prefix = prefix;
        
        this.path = (prefix ? prefix + '/' : '') + name; 
    }

    listFiles() {
        log.debug(`Listing files in ${this.bucketName}, path: ${this.name}`);

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

                let files = [];
                if (data.Contents) {
                    files = data.Contents.map(obj => {
                        const fromIndex = obj.Key.lastIndexOf('/') + 1;
                        const name = obj.Key.substr(fromIndex);

                        return new S3File(name, 
                            this.path, 
                            this.bucketName);
                    });
                }

                log.debug(`Contents of ${this.name}: ${files}`);

                resolve(files);
            });
        });
    }

    async listDirectories() {
        log.debug(`Listing directories in ${this.bucketName}, path: ${this.path}`);

        const params = {
            Bucket: this.bucketName,
            Prefix: this.path ? this.path + '/' : this.path,
            Delimiter: '/',
            MaxKeys: 5000
        };

        let data = {};
        let result = [];
        do {
            params.ContinuationToken = data.continuationToken;
            
            data = await new Promise((resolve, reject) => {
                s3.listObjectsV2(params, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let dirs = [];
                    if (data.CommonPrefixes) {
                        dirs = data.CommonPrefixes.map(prefix => {
                            let name = prefix.Prefix;
                            
                            name = name.substr(0, name.lastIndexOf('/'));
                            name = name.substr(name.lastIndexOf('/') + 1, name.length);
                            
                            return new S3Directory(this.bucketName, name, this.path);
                        });
                    }

                    log.debug(`Found ${dirs.length} directories in: ${this.name}`);

                    dirs = dirs.sort((a, b) => a.name.localeCompare(b.name));

                    resolve({
                        dirs,
                        continuationToken: data.NextContinuationToken
                    });
                });
            });

            result = result.concat(data.dirs);
        } while (data.continuationToken);

        return result;
    }

    getFileHandle(filename) {
        return new S3File(filename, this.path, this.bucketName, s3);
    }

    async countChildren() {
        const children = await this.listDirectories();
        return children.length
    }

    async findChildrenThatMatch(predicate) {
        const children = await this.listDirectories();

        const results = await Promise.all(children.map(async s3dir => { 
            const shouldKeep = await predicate(s3dir);
            return shouldKeep ? s3dir : null;
        }));

        return results.filter(val => val);
    }

    async countChildrenThatMatch(predicate) {
        const children =  await this.findChildrenThatMatch(predicate);
        return children.length;
    }

    async hasChildrenThatMatch(predicate) {
        return await this.countChildrenThatMatch(predicate) > 0;
    }
}

module.exports = S3Directory;
