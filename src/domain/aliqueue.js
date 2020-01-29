class AliQueue {

    constructor(){

    }

    getAddAliQueueSQL() {
        let sql = `INSERT INTO ALI_QUEUE SET ?`
        return sql;
    }

    static getAliQueueByIdSQL() {
        let sql = `SELECT * FROM ALI_QUEUE WHERE id=?`;
        return sql;
    }

    static getAliQueueByFieldNameSQL(fieldName) {
        let sql = `SELECT * FROM ALI_QUEUE WHERE ${fieldName}=?`
        return sql;
    }

    static updateAliQueueByFieldNameSQL(fields, condition){
        let sql = `UPDATE ALI_QUEUE SET ${fields} WHERE ${condition}`
        return sql
    }

    static deleteAliQueueByIdSQL() {
        let sql = `DELETE FROM ALI_QUEUE WHERE id=?`;
        return sql;
    }

    static getAllAliQueueSQL() {
        let sql = `SELECT * FROM ALI_QUEUE`;
        return sql;
    }    
}

module.exports = AliQueue;