class Store {

    constructor(store_id, store_name, store_url, store_feedbacks, seller_since) {
        this.store_id=store_id;
        this.store_name=store_name;
        this.store_url=store_url;
        this.store_feedbacks = store_feedbacks;
        this.seller_since = seller_since;
    }

    getAddStoreSQL() {
        let sql = `INSERT INTO STORES(store_id, store_name, store_url, store_feedbacks, seller_since) \
                   VALUES(${this.store_id}, '${this.store_name}', '${this.store_url}', '${this.store_feedbacks}', '${this.seller_since}')`;
        return sql;
    }

    static getStoreByIdSQL(id) {
        let sql = `SELECT * FROM STORES WHERE id = ${id}`;
        return sql;
    }

    static deleteStoreByIdSQL(id) {
        let sql = `DELETE FROM STORES WHERE id = ${id}`;
        return sql;
    }

    static getAllStoreSQL() {
        let sql = `SELECT * FROM STORES`;
        return sql;
    }
}

export default Store;