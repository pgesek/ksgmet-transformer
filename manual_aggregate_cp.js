const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { findAggregateDirs } = require('./src/db/find_aggregate_dirs');
const log = require('./src/util/log');
const settings = require('./src/util/settings');
const FileStore = require('./src/files/file_store');
const S3Uploader = require('./src/s3/s3_uploader');
const moment = require('moment-timezone');

const START = 0;
const STOP = 1000;

const FORMAT = 'YYYY_MM_DD_HH'

const fileStore = new FileStore();
const s3Uploader = new S3Uploader(settings.TARGET_BUCKET, 'aggregates');

async function cpAggregates() {
    let aggregateDirs = await findAggregateDirs();
    log.info(`Found ${aggregateDirs.length} aggregates`);

    aggregateDirs = aggregateDirs.filter(aggregateDir => {
        const dateElem = aggregateDir.prefix.replace('ksgmet-csv/', '')

        const date = moment.tz(dateElem, FORMAT, settings.TIMEZONE);

        return date.isAfter('2019-07-14', 'day') &&
               date.isBefore('2019-07-16', 'day');
    });

    log.info('Filtered aggregate count: ' + aggregateDirs.length);

    const endIndex = STOP < aggregateDirs.length ? STOP : aggregateDirs.length;
    for (let i = START; i < endIndex; i++) {
        const aggregateDir = aggregateDirs[i];

        const aggregate = aggregateDir.getFileHandle('aggregate.csv');

        const newName = figureNewName(aggregate);

        log.info(`[${i}] Copying ${aggregate.toString()} to ${settings.AGGREGATE_DIR}/${newName}`);

        // await aggregate.copyTo(settings.TARGET_BUCKET, settings.AGGREGATE_DIR,
        //    newName);

        await fetchGzipUpload(aggregate);
    }
}

function figureNewName(s3File) {
    const parts = s3File.path.split('/');
    
    const date = parts[1];
    const length = parts[2];

    return `aggregate_${date}_${length}.csv.gz`;
}

async function fetchGzipUpload(s3File) {
    const newName = figureNewName(s3File);
    const dirPrefix = newName.substring(0, newName.length - 7);

    const filePath = await s3File.fetch(fileStore, dirPrefix);

    const targetPath = path.join(
        fileStore.getFullTmpDirForPrefix(dirPrefix),
        newName
    );

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(targetPath);
    const gzip = zlib.createGzip();

    return new Promise((resolve, reject) => {
        readStream.pipe(gzip).pipe(writeStream).on('finish', async err => {
            if (err) {
                reject();
            }

            readStream.close();
            writeStream.close();
        
            const fileToUpload = {
                filePath: targetPath
            };
            
            await s3Uploader.uploadFile(fileToUpload);

            await fileStore.rmTmpDir(dirPrefix);

            resolve(targetPath);
        });
    });
}

cpAggregates().then(() => log.info('Done'));
