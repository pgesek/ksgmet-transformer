const { Pool } = require('pg');
const log = require('../util/log');

class PgClient {
    constructor() {
        this.pool = new Pool();
    }

    async loadAggregateFile(filePath, columns) {
        const columnString = columns.join(', ');
        const query =  `COPY fact_prediction (${columnString})`
            + ` FROM '${filePath}' DELIMITER ',' CSV HEADER`;

        log.debug('Executing query: ' + query);

        const res = await this.pool.query(query);

        log.info(JSON.stringify(res));
    }

    async deleteJunk() {
        await this.pool.query('DELETE FROM fact_prediction WHERE tmin2m_actual = -999000000')
    }

    async dbNow() {
        return await this.pool.query('SELECT NOW()');
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = PgClient;
