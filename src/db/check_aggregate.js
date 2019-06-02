const ReadLines = require('n-readlines');
const log = require('../util/log');
const { EXPECTED_COLUMNS, SKIPPABLE_COLUMNS, EXTRA_COLUMNS } = require('../util/columns');


function checkAggregate(filePath) {
    const reader = new ReadLines(filePath);

    const line = reader.next().toString('UTF-8');

    reader.close();

    const headers = line.split(',');
 
    // missing columns
    EXPECTED_COLUMNS.forEach(expectedColumn => {
        if (!headers.includes(expectedColumn)) {
            log.info(`Header incorrect, ${expectedColumn} missing`);
            if (!SKIPPABLE_COLUMNS.includes(expectedColumn)) {
                throw 'Missing column in aggregate: ' + expectedColumn;
            } else {
                log.info('Acceptable');
            }
        }
    });

    // extra columns
    headers.filter(header => !EXPECTED_COLUMNS.includes(header))
        .forEach(extraColumn => {
            log.info('Found extra column: ' + extraColumn);
            if (!EXTRA_COLUMNS.includes(extraColumn)) {
                throw new 'Unexpected column: ' + extraColumn;
            }
        });

    return headers;
}

module.exports = checkAggregate;
