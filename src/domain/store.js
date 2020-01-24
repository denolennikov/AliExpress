class Store {

    constructor() {
        
    }

    getAddStoreSQL() {
        let sql = `INSERT INTO STORES SET ?`
        return sql;
    }

    static getStoreByIdSQL() {
        let sql = `SELECT * FROM STORES WHERE id=? `;
        return sql;
    }

    static deleteStoreByIdSQL() {
        let sql = `DELETE FROM STORES WHERE id=? `;
        return sql;
    }

    static getAllStoreSQL() {
        let sql = `SELECT * FROM STORES`;
        return sql;
    }
}

export default Store;