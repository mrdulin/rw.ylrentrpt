var mysql = require('mysql');

var alirdspool  = mysql.createPool({
	connectionLimit : 5,
	host:'rds9n1nb1604z6l7l9m2o.mysql.rds.aliyuncs.com',
	user:'nodeclient',
	password:'Pass_word',
	database:'yuanlai',
	timezone:'utc'  // this is for time convert 

});

exports = module.exports = alirdspool;