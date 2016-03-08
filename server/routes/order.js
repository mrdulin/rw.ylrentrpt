var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');

router.get('/:roomNo/:startdate/:enddate',(req,res)=>{
	pool.query('select * from order where roomNo = ?',req.params.roomNo,(req,res)=>{
		if(err)
		{
			console.error(err);
			return;
		}

		else
		{
			if(result.length==0)
			{
				res.json("no order found");
			}
			else
			{
				res.json(result);
			}
		}
	})

})

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

