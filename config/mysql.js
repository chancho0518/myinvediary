const mysql = require('mysql');

const mysqlConnection = {
    init: function() {
        return mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            port: process.env.port,
            database: process.env.database
        });

    },
    open: function(connection) {
        connection.connect(function(err) {
            if(!err) {
                console.log("MySQL Connected!!!");
            }
            if(err) {
                console.log("- fail to connect MySQL -\n ", err);
            }
        });
    },
    close: function(connection) {
        connection.end(function(err) {
            if(!err) {
                console.log("MySQL Terminated...");
            }
            if(err) {
                console.log("- fail to terminate MySQL -\n", err);
            }
        });
    }
}

module.exports = mysqlConnection;