// database/connection.js
const mysql2 = require("mysql2");
require('dotenv').config();

let connectionParams;

const useLocalhost = process.env.USE_LOCALHOST === 'true';

if (useLocalhost) {
    console.log("Using local database configuration");
    connectionParams = {
        user: process.env.LOCAL_DB_USER,
        host: process.env.LOCAL_DB_HOST,
        password: process.env.LOCAL_DB_PASSWORD,
        database: process.env.LOCAL_DB_DATABASE,
    };
} else {
    console.log("Using server database configuration");
    connectionParams = {
        user: process.env.DB_SERVER_USER,
        host: process.env.DB_SERVER_HOST,
        password: process.env.DB_SERVER_PASSWORD,
        database: process.env.DB_SERVER_DATABASE,
    };
}

const pool = mysql2.createConnection(connectionParams);

pool.connect((err) => {
    if (err) console.log(err.message);
    else console.log("DB Connection established");
});

module.exports = pool;
