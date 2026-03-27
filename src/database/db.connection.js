import '../config/env.config.js'
import mysql from "mysql2/promise";

const db = mysql.createPool(process.env.MY_SQL_URL);

export default db;