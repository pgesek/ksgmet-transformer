const downloadAggregate = require('./download_aggregate');
const findAggregateDirs = require('./find_aggregate_dirs');
const PgClient = require('./pg_client');
const log = require('../util/log');
const FileStore = require('../files/file_store');

class DataLoader {
    
    constructor() {
        this.fileStore = new FileStore();
        this.pgClient = new PgClient();
    }

    async loadData(start, end) {
        log.info(`Downloading data from ${start} to ${end}`);
    
        log.info('Looking for aggregates');

        const aggregateDirs = await findAggregateDirs();
    
        log.info('Found total number of aggregate dirs: ' + aggregateDirs.length);
    
        for (let i = start; i < end; i++) {
            const dir = aggregateDirs[i];
            
            log.info('Download aggregate from: ' + dir.path);
    
            const aggregate = await downloadAggregate(dir, this.fileStore, dir.name);
            
            log.info(`Loading aggregate from: ${dir.path} to the DB`);
    
            // await this.pgClient.loadAggregateFile(aggregate);
    
            await this.fileStore.rmDir(dir.name);
        }
    }

    async end() {
        await this.pgClient.end();
    }
}



module.exports = DataLoader;