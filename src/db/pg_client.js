const { Pool } = require('pg');

class PgClient {
    constructor() {
        this.pool = new Pool();
    }

    loadAggregateFile(filePath) {
        const res = await pool.query(`COPY persons(first_name,last_name,dob,email) 
            FROM '${filePath}' DELIMITER ',' CSV HEADER;`);
    }

    async dbNow() {
        return await pool.query('SELECT NOW()');
    }
}