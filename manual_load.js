const log = require('./src/util/log');
const DataLoader = require('./src/db/data_loader');

const START = 68;
const END = 600;

const loader = new DataLoader();

async function loadData() {
    await loader.loadData(START, END);
}

loadData().then(async () => { 
    await loader.end();
    log.info('Done')
});
