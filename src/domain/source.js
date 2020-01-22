class Source {
    
    constructor(store_name, store_country, store_language, store_url) {
        this.store_name = store_name;
        this.store_contry = store_country;
        this.store_language = store_language;
        this.store_url = store_url;
    }

    getAddSourceSQL() {
        let sql = `INSERT INTO SOURCES(store_name, store_country, sotre_language, store_url) \
                   VALUES('${this.store_name}', '${this.store_contry}', '${this.store_language}', '${this.store_url}')`;
        return sql;
    }

    static getSourceByIdSQL(id) {
        let sql = `SELECT * FROM SOURCES WHERE id = ${id}`;
        return sql;
    }

    static deleteSourceByIdSQL(id) {
        let sql = `DELETE FROM SOURCES WHERE id = ${id}`;
        return sql;
    }

    static getAllSourceSQL() {
        let sql = `SELECT * FROM SOURCES`;
        return sql;
    }

    static getSourceByLanguageSQL(store_language) {
        let sql = `SELECT store_url FROM SOURCES WHERE store_language = '${store_language}'`
        return sql;
    }
}

export default Source;