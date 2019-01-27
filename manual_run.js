const Transformer = require('./src/transformer.js');
const log = require('./src/util/log.js');
const S3finder = require('./src/s3/s3_finder.js');
const moment = require('moment-timezone');

const finder = new s3finder();

//const transformer = new Transformer();
//transformer.transform('2018_10_24_20_00_50').then(() => log.info('Script finished'));
