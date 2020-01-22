class AliRequest {

    constructor(uuid, num_proucts) {
        this.uuid = uuid;
        this.num_products = num_proucts;
    }

    getAddAliRequestSQL() {
        let sql = `INSERT INTO ALI_REQUESTS(uuid, num_products) \
                   VALUES('${this.uuid}',${this.num_products})`;
        return sql;
    }

    static getAliRequestByIdSQL(id) {
        let sql = `SELECT * FROM ALI_REQUESTS WHERE id = ${id}`;
        return sql;
    }

    static deleteAliRequestByIdSQL(id) {
        let sql = `DELETE FROM ALI_REQUESTS WHERE id = ${id}`;
        return sql;
    }

    static getAllAliRequestSQL() {
        let sql = `SELECT * FROM ALI_REQUESTS`;
        return sql;
    }
}

export default AliRequest;