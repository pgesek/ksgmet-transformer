const { findAggregateDirs } = require('./src/db/find_aggregate_dirs');
const log = require('./src/util/log');
const settings = require('./src/util/settings');

async function cpAggregates() {
    const aggregateDirs = await findAggregateDirs();
    log.info(`Found ${aggregateDirs.length} aggregates`);

    for (let i = 0; i < 2; i++) {
        const aggregateDir = aggregateDirs[i];

        const aggregate = aggregateDir.getFileHandle('aggregate.csv');

        const newName = figureNewName(aggregate);

        log.info(`[${i}] Copying ${aggregate.toString()} to ${settings.AGGREGATE_DIR}/${newName}`);

        await aggregate.copyTo(settings.TARGET_BUCKET, settings.AGGREGATE_DIR,
            newName);
    }
}

function figureNewName(s3File) {
    const parts = s3File.path.split('/');
    
    const date = parts[1];
    const length = parts[2];

    return `aggregate_${date}_${length}.csv`;
}

cpAggregates().then(() => log.info('Done'));
