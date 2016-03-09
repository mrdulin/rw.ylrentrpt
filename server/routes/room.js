var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');

router.get('/:roomNo',(req,res)=> {
	pool.query('select r.roomName, r.roomNo,r.hasLock,r.hotelNo,h.hotelName,t.roomTypeNo,t.roomTypeName,t.roomTypePrice from room as r join room_type as t on r.roomTypeNo = t.roomTypeNo join hotel as h on r.hotelNo = h.hotelNo where r.roomNo = ?', req.params.roomNo,(err,result)=>{
		if(err)
		{
			console.error(err)
		}
		if(result.length ==0) {result.json("no room found");return;}
		res.json(result);
	})
})

//sample time input 2015-1-1 
router.get('/:roomNo/order/start/:startdate/end/:enddate',(req,res)=>{
	var query = pool.query('select * from orders where  roomNo = ? and checkintime >= ? and checkouttime <= ?',[
		req.params.roomNo,req.params.startdate,req.params.enddate],(err,result)=>{
		console.log("aaaa"+query.sql);
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


exports = module.exports = router;
