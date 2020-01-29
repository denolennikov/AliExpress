class AliRequest {

    constructor() {
    }

    getAddAliRequestSQL() {
        let sql = `INSERT INTO ALI_REQUESTS SET ?`
        return sql;
    }

    static getAliRequestByIdSQL() {
        let sql = `SELECT * FROM ALI_REQUESTS WHERE id=?`;
        return sql;
    }

    static deleteAliRequestByIdSQL() {
        let sql = `DELETE FROM ALI_REQUESTS WHERE id=?`;
        return sql;
    }

    static getAllAliRequestSQL() {
        let sql = `SELECT * FROM ALI_REQUESTS`;
        return sql;
    }
}

module.exports = AliRequest
