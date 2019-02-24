const Transformer = require('./src/transformer.js');
const log = require('./src/util/log.js');

const transformer = new Transformer();
transformer.transform('2018_10_24_20_00_50').then(() => log.info('Script finished'));
