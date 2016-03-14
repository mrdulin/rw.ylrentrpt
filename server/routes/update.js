var express = require('express');
var RoomRoute = require('./room');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var error = require('../error.js')

router.get('/lastupdatetime',(req,res)=>{
	pool.query('select atWhen from updates',(err,result)=>{
		if(result.length == 0)
		{
			res.send({status:0,atWhen:''}).end();
		}
		else
		{
			res.send({status:1,atWhen:result[0].atWhen}).end();
		}
	})
})


exports = module.exports = router;
