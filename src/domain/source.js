class Source {

    constructor() {
        
    }

    getAddSourceSQL() {
        let sql = `INSERT INTO SOURCES SET ?`
        return sql;
    }

    static getSourceByIdSQL() {
        let sql = `SELECT * FROM SOURCES WHERE id=?`;
        return sql;
    }

    static deleteSourceByIdSQL() {
        let sql = `DELETE FROM SOURCES WHERE id=?`;
        return sql;
    }

    static getAllSourceSQL() {
        let sql = `SELECT * FROM SOURCES`;
        return sql;
    }

    static getSourceByFieldNameSQL(fieldName) {
        let sql = `SELECT * FROM SOURCES WHERE ${fieldName}=?`
        return sql;
    }
}

module.exports = Source