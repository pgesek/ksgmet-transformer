const { Pool } = require('pg');
const log = require('../util/log');

class PgClient {
    constructor() {
        this.pool = new Pool();
    }

    async loadAggregateFile(filePath) {
        const query =  `COPY fact_prediction (acm_convective_percip_actual, acm_convective_percip_delta,`
            + `acm_convective_percip_local_max_actual, acm_convective_percip_local_max_delta, acm_convective_percip_local_max_predicted,` 
            + `acm_convective_percip_local_min_actual, acm_convective_percip_local_min_delta, acm_convective_percip_local_min_predicted,`
            + `acm_convective_percip_predicted, acm_total_percip_actual, acm_total_percip_delta, acm_total_percip_predicted, actual_diff,`
            + `avg_total_cld_frac_actual, avg_total_cld_frac_delta, avg_total_cld_frac_predicted, domain_percip_type_fr_actual, domain_percip_type_fr_delta,`
            + `domain_percip_type_fr_predicted, domain_percip_type_ip_actual, domain_percip_type_ip_delta, domain_percip_type_ip_predicted,`
            + `domain_percip_type_r_actual, domain_percip_type_r_delta, domain_percip_type_r_predicted, domain_percip_type_s_actual, domain_percip_type_s_delta,`
            + `domain_percip_type_s_predicted, fsi_actual, fsi_delta, fsi_predicted, high_cloud_fraction_actual, high_cloud_fraction_delta,`
            + `high_cloud_fraction_predicted, lifted_index_actual, lifted_index_delta, lifted_index_predicted, location, low_cloud_fraction_actual,`
            + `low_cloud_fraction_delta, low_cloud_fraction_predicted, mid_cloud_fraction_actual, mid_cloud_fraction_delta, mid_cloud_fraction_predicted,`
            + `prediction_date, prediction_length, prediction_time, prediction_timestamp, prediction_type, shelter_dewpoint_actual, shelter_dewpoint_delta,`
            + `shelter_dewpoint_predicted, shelter_rel_humid_actual, shelter_rel_humid_delta, shelter_rel_humid_predicted, shelter_temperature_actual,`
            + `shelter_temperature_delta, shelter_temperature_predicted, skin_temperature_actual, skin_temperature_delta, skin_temperature_predicted,`
            + `soil_temperature_actual, soil_temperature_delta, soil_temperature_predicted, surface_pressure_actual, surface_pressure_delta,`
            + `surface_pressure_predicted, surface_rel_humid_actual, surface_rel_humid_delta, surface_rel_humid_predicted, t2mean2m_actual, t2mean2m_delta,`
            + `t2mean2m_predicted, tmax2m_actual, tmax2m_delta, tmax2m_predicted, tmin2m_actual, tmin2m_delta, tmin2m_predicted, type, u_storm_motion_6km_actual,`
            + `u_storm_motion_6km_delta, u_storm_motion_6km_predicted, u_wind_on_10m_actual, u_wind_on_10m_delta, u_wind_on_10m_predicted, v_storm_motion_6km_actual,`
            + `v_storm_motion_6km_delta, v_storm_motion_6km_predicted, v_wind_on_10m_actual, v_wind_on_10m_delta, v_wind_on_10m_predicted, visibility_actual,`
            + `visibility_delta, visibility_predicted, wind_gust_actual, wind_gust_delta, wind_gust_predicted, wvc_actual, wvc_delta, wvc_predicted, x, y)`
            + ` FROM '${filePath}' DELIMITER ',' CSV HEADER`;
        
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
