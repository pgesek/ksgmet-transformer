const log = require('./src/util/log');
const DataLoader = require('./src/db/data_loader');

const START = 500; //71-73 ?
const END = 800;

// 2019_04_01_05/33h

const loader = new DataLoader();

async function loadData() {
    await loader.loadData(START, END);
}

loadData().then(async () => { 
    await loader.end();
    log.info('Done')
});
