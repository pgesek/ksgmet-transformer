const log = require('./src/util/log');
const CsvSorter = require('./src/csv_sorter');
const plFilter = require('./src/sort/pl_filter');
const S3Directory = require('./src/s3/s3_directory');
const settings = require('./src/util/settings');

const sorter = new CsvSorter();

const START = 33;
const END = 100;

runTransformations(START, END).then(() => log.info('Done'));

async function runTransformations(startIndex, endIndex) {
    const rootDir = new S3Directory(settings.S3_BUCKET_NAME, '');
    const subDirs = await rootDir.listDirectories();
    
    for (let i = startIndex; i < endIndex; i += 1) {
        const dir = subDirs[i].path;
        
        log.info('Sorting dir: ' + dir);
        
        await sorter.sortTars(dir, plFilter)
        
        log.info('Finished sorting dir: ' + dir);
    }
}
