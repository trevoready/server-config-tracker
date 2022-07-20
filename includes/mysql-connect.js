var mysql = require('mysql');
const { promisify } = require('util')
require('dotenv').config()
var pool  = mysql.createPool({
  dateStrings     : true,
  connectionLimit : 10,
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});
exports.query = promisify(pool.query).bind(pool)
exports.pool = pool