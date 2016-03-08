var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');

router.get('/:roomNo',(req,res)=> {
	pool.query('select * from room where roomNo = ?', req.params.roomNo,(err,result)=>{
		if(err)
		{
			console.error(err)
		}
		if(result.length ==0) {result.json("no room found");return;}
		res.json(result);
	})
})




exports = module.exports = router;
