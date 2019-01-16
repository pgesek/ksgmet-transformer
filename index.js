'use strict';

const Transformer = require('./src/transformer.js');

exports.handler = async event => {
    const transformer = new Transformer();
    await transformer.transform();
}
