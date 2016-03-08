var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');


router.get('/:orderNo',(req,res)=>{
	pool.query('select * from order where orderNo = ?',req.params.orderNo,(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length ==0 )
			{
				res.json("no such order");
			}
			else
			{
				res.json(result);
			}
		}
	})
})

exports = module.exports = router;

