const transformerRunner = require('./src/transformer_runner')
const log = require('./src/util/log')

const START = 0;
const END = 1;

Promise.all([transformerRunner(START, END)])
    .then(() => log.info('Finished'));
