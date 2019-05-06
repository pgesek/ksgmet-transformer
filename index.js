'use strict';

const CsvSorter = require('./src/csv_sorter');
const log = require('./src/util/log');
const settings = require('./src/util/settings');
const validateTarPath = require('./src/s3/tar_path_validator');
const S3File = require('./src/s3/s3_file');

const PUT_EVENT = 'ObjectCreated:Put';

const plFilter = fileName => fileName.startsWith('pl_csv_');
const sorter = new CsvSorter();

exports.handler = async event => {
    const records = event.Records;
    
    if (records) {
        log.info('Event has ' + records.length + ' records');
        
        await Promise.all(records.map(async record => {
            const type = record.eventName;
            log.info('Handling record of event type: ' + type);
            await handleCreateEvent(record);
        }));    
    } else {
        log.info('No records in event');
    }
}

async function handleCreateEvent(record) {
    const bucket = record.s3.bucket.name;
    if (bucket === settings.S3_BUCKET_NAME) {
        log.info('Event from bucket: ' + bucket);

        const key = record.s3.object.key;

        if (validateTarPath(key, plFilter)) {
            await executeSort(key);
        } else {
            log.info('Path does match filter: ' + key);
        }
    } else {
        log.info('Ignoring bucket: ' + bucket);
    }
}

async function executeSort(key) {
    // was already validated
    const [ path, name ] = key.split('/');

    const s3File = new S3File(name, path, settings.S3_BUCKET_NAME);

    await sorter.processTarFile(s3File);
}
