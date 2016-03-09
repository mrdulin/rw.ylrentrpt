var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');


router.get('/:orderNo',(req,res)=>{
	pool.query('select * from orders where orderNo = ?',req.params.orderNo,(err,result)=>{
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

//sample time input 2015-1-1 , get the checked in customer list
router.get('/checkin/start/:startdate/end/:enddate',(req,res)=>{
	 pool.query('select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc from to_check_in_list where checkInDate <= ? and checkInDate>= ? order by checkInDate',[req.params.enddate,req.params.startdate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length == 0 )
			{
				res.json("no checkins");
			}
			else
			{
				res.json(result);
			}
		}
	})
})


router.get('/checkout/start/:startdate/end/:enddate',(req,res)=>{
  pool.query('select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc from to_check_out_list where checkOutDate <= ? and checkOutDate>= ? order by checkOutDate',[req.params.enddate,req.params.startdate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length == 0 )
			{
				res.json("no checkouts");
			}
			else
			{
				res.json(result);
			}
		}
	})
})


router.get('/dailyrents/start/:startdate/end/:enddate',(req,res)=>{
	//pool.query()
})

exports = module.exports = router;

