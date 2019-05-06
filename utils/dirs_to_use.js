const S3Directory = require('../src/s3/s3_directory');
const settings = require('../src/util/settings');

async function dirsToUse() {
    const rootDir = new S3Directory(settings.TARGET_BUCKET,
        settings.TARGET_SORT_PREFIX);
    
    const count = await rootDir.countChildrenThatMatch(
        async s3Dir => await s3Dir.hasChildrenThatMatch(
            childDir => childDir.path.includes('/-')));


    console.log('Number of predictions with a 2h prediction: ' + count);
}

dirsToUse().then(() => console.log('Done'));
