var moment = require('moment');

class AliQueue {

    constructor(
        uuid, 
        productCode, 
        language, 
        product_info_payload, 
        status, 
        failed_at, 
        imported, 
        reserved_at, 
        finished_at,
        created_at,
        updated_at
    ) {
        this.uuid = uuid;
        this.product_code = productCode;
        this.language = language;
        this.product_info_payload = product_info_payload;
        this.status = status;
        this.failed_at = failed_at;
        this.imported = imported;
        this.reserved_at = reserved_at;
        this.finished_at = finished_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    getAddAliQueueSQL() {
        let sql = `INSERT INTO ALI_QUEUE(
                        uuid, 
                        product_code, 
                        language, 
                        product_info_payload, 
                        status, 
                        failed_at, 
                        imported, 
                        reserved_at, 
                        finished_at,
                        created_at,
                        updated_at
                    ) \
                    VALUES(
                        '${this.uuid}',
                        '${this.product_code}',
                        '${this.language}',
                        '${this.product_info_payload}',
                        '${this.status}',
                        '${this.failed_at}',
                        ${this.imported},
                        '${this.reserved_at}',
                        '${this.finished_at}',
                        '${this.created_at}',
                        '${this.updated_at}'
                    )`;
        return sql;
    }

    static getAliQueueByIdSQL(id) {
        let sql = `SELECT * FROM ALI_QUEUE WHERE id = ${id}`;
        return sql;
    }

    static getAliQueueByFieldNameSQL(name, value) {
        let sql = `SELECT * FROM ALI_QUEUE WHERE ${name} = '${value}'`;
        return sql;
    }

    static updateAliQueueByFieldNameSQL(param, condition){
        // let a = [param, condition]
        // console.log(a)
        let sql = `'UPDATE ALI_QUEUE SET ? WHERE ?', ${[
            { 'status': 'RESERVED', 'reserved_at': '2020-01-22 12:28:29' },
            { 'product_code': '32940810951' }
          ]}`
        return sql
    }

    static deleteAliQueueByIdSQL(prd_id) {
        let sql = `DELETE FROM ALI_QUEUE WHERE id = ${id}`;
        return sql;
    }

    static getAllAliQueueSQL() {
        let sql = `SELECT * FROM ALI_QUEUE`;
        return sql;
    }    
}

export default AliQueue;