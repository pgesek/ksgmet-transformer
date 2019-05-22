const { Pool } = require('pg');

class PgClient {
    constructor() {
        this.pool = new Pool();
    }

    async loadAggregateFile(filePath) {
        const res = await this.pool.query(`COPY persons(first_name,last_name,dob,email) 
            FROM '${filePath}' DELIMITER ',' CSV HEADER;`);
    }

    async dbNow() {
        return await this.pool.query('SELECT NOW()');
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = PgClient;
