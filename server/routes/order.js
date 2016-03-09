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

//sample time input 2015-1-1 
router.get('/checkin/:startdate/:enddate',(req,res)=>{
	var query = pool.query('select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc from to_check_in_list where checkInDate <= ? and checkInDate>= ?',[req.params.enddate,req.params.startdate],(err,result)=>{
		console.log(query);
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

exports = module.exports = router;

