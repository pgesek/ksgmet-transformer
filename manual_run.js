const Transformer = require('./src/transformer.js');
const log = require('./src/util/log.js');

const transformer = new Transformer();
transformer.transform().then(() => log.info('Script finished'));
