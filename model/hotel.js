const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 5,
	host:'ylrent.mysqldb.chinacloudapi.cn',
	user:'ylrent%jason',
	password:'Password01!'
});


function Hotel(jsonObj)
{
	jsonObj = jsonObj || {};
	this.hotelNo = jsonObj.hotelNo;
	this.hotelName = jsonObj.hotelName;
	this.isOnwer = jsonObj.isOwner;
	this.isAdmin = jsonObj.isAdmin;
}


Hotel.prototype.Query = function(){

	pool.query('select * from hotel',function(err,result){
		if(err)
		{
			console.error(err);
			return;
		}

		else
			return result;

	})
}

exports = module.exports = Hotel;