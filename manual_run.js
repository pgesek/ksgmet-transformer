const transformerRunner = require('./src/transformer_runner')
const log = require('./src/util/log')

const START = 0;
const END = 3;

transformerRunner(START, END).then(() => 
    log.info('Finished'));
