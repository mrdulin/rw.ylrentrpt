var express = require('express');
var RoomRoute = require('./room');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var error = require('../error.js');
var alirdspool = require('../service/alimysqlConnect');

router.get('/',(req,res)=>{
	alirdspool.query('select id as hotelNo, title as hotelName from tbl_building',(err,result)=>{
		if(err)
		{
			res.status(500).json(err);
		}
		else
		{
			res.json(result);
		}
	})
})


exports = module.exports = router;

