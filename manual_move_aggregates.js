const log = require('./src/util/log');
const settings = require('./src/util/settings');
const S3Directory = require('./src/s3/s3_directory');

const TARGET_DIR = 'june';

async function moveAggregates() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET, 'aggregates', '');

    let aggregates = await rootDir.listFiles();
    
    log.info(`Fetched ${aggregates.length} aggregates`);

    aggregates = aggregates.filter(aggregate => {
        const START = 'aggregate_2019_06_';
        const END = 'aggregate_2019_07_'
        if (aggregate.fileName.startsWith(START) ||
            aggregate.fileName.startsWith(END)) {

            const day = parseInt(aggregate.fileName.substr(START.length, 2));
            const month = parseInt(aggregate.fileName.substr(START.length - 3, 2));
            
            return (month === 6 && day > 15) || (month === 7 && day <= 15);
        } else {
            return false;
        }
    });

    log.info(`Filtered to ${aggregates.length} aggregates`);

    for (let i = 0; i < aggregates.length; i++) {
        const aggregate = aggregates[i];

        //await copy(aggregate);
        await rm(aggregate);
    }
}

async function copy(s3File) {
    log.info('Copying: ' + s3File.fileName);

    await s3File.copyTo(
        settings.TARGET_BUCKET,
        'aggregates-sorted/' + TARGET_DIR,
        s3File.fileName);
}

async function rm(s3File) {
    log.info('Removing: ' + s3File.toString());
    await s3File.rmOnS3();
}

moveAggregates().then(() => log.info('Done'));
