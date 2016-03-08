var mysql = require('mysql');

var pool  = mysql.createPool({
	connectionLimit : 5,
	host:'ylrent.mysqldb.chinacloudapi.cn',
	user:'ylrent%jason',
	password:'Password01!',
	database:'ylrentdb'
});

exports = module.exports = pool;