import mysql from "mysql";
 
const pool = mysql.createPool({
                connectionLimit : 10,
                host     : '127.0.0.1',
                user     : 'root',
                password : 'password',
                database : 'Aliexpress',
                debug    : false 
            });
 
function executeQuery(sql, params, callback) {
    pool.getConnection((err, connection) => {
        if(err) {
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, params, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(error, null);
                    } 
                    return callback(null, results);
                });
            }
        }
    });
}
 
function query(sql, params, callback) {
    executeQuery(sql, params, function(err, data) {
        if(err) {
            return callback(err);
        }       
        callback(null, data);
    });
}
 
module.exports = {
    query: query
}