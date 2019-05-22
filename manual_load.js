const log = require('./src/util/log')
const PgClient = require('./src/db/pg_client');

const pgClient = new PgClient();

async function loadData() {
    const date = await pgClient.dbNow();
    log.info('Date is: ' + date.rows[0].now);
}

loadData().then(async () => { 
    await pgClient.end();
    log.info('Done')
});
