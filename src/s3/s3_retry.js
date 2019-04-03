const log = require('../util/log');

async function s3Retry(operation, retries = 5) {
    let retryCount = 0;
    let success = false;
    let retVal;
    
    while (!success) {
        try {
            retVal = await operation();
            success = true;
        } catch (ex) {
            if (retryCount == retries) {
                throw ex;
            } else {
                retryCount++;
                log.error('s3 error caught - will retry', ex);
            }
        }
    }

    return retVal;
}

module.exports = s3Retry;
