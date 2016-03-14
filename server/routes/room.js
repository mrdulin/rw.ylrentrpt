var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var moment = require('moment');
var error = require('../error.js')

router.get('/:roomNo',(req,res)=> {
	console.log('in');
	pool.query('select r.roomName, r.roomNo,r.hasLock,r.hotelNo,h.hotelName,t.roomTypeNo,t.roomTypeName,t.roomTypePrice from room as r join room_type as t on r.roomTypeNo = t.roomTypeNo join hotel as h on r.hotelNo = h.hotelNo where r.roomNo = ?', req.params.roomNo,(err,result)=>{
		if(err)
		{
			console.error(err)
		}
		//if(result.length ==0) {result.json("no room found");return;}
		res.json(result);
	})
})

//sample time input 2015-1-1 
router.get('/:roomNo/order/start/:startdate/end/:enddate',(req,res)=>{
	pool.query('select * from orders where  roomNo = ? and checkintime >= ? and checkouttime <= ?',[
		req.params.roomNo,req.params.startdate,req.params.enddate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}

		else
		{

			res.json(result);
			
		}
	})

})

//get the oooroom for all rooms starting from the startdate
router.get('/oooroom/date/:date',(req,res)=>{
	 var query = pool.query("select orderNo,customer as oooReason, cast(checkintime as date) as oooDate, r.roomNo, r.roomName,h.hotelName, h.hotelNo from orders as o join room as r on o.roomNo = r.roomNo join hotel as h on r.hotelNo = h.hotelNo where customer Regexp '交房|打扫|家具|装修|维修|长租准备'  and  cast(checkouttime as date) >= ? and cast(checkintime as date) <= ?",
	 	[req.params.date,req.params.date],(err,result)=>{
	 		console.log(query.sql);
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{

			res.json(result);
			
		}
	 })
})



exports = module.exports = router;
