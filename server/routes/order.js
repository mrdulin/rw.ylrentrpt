var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var alirdspool = require('../service/alimysqlConnect');
var error = require('../error.js')


router.get('/:orderNo',(req,res)=>{
	pool.query("select * from orders where orderNo = ? and customer NOT REGEXP '维修|装修|准备|无房|投诉|家具|打扫|交房|开荒|看房'",req.params.orderNo,(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length ==0 )
			{
				res.status(501).json(error.NO_RECORD_FOUND);
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
	 pool.query("select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc from to_check_in_list where checkInDate <= ? and checkInDate>= ? and customer NOT REGEXP '维修|装修|准备|无房|投诉|家具|打扫|交房|开荒|看房' order by checkInDate",[req.params.enddate,req.params.startdate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length == 0 )
			{
				res.status(501).json(error.NO_RECORD_FOUND);
			}
			else
			{
				res.json(result);
			}
		}
	})
})


router.get('/checkout/start/:startdate/end/:enddate',(req,res)=>{
  pool.query("select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc from to_check_out_list where checkOutDate <= ? and checkOutDate>= ? and customer NOT REGEXP '维修|装修|准备|无房|投诉|家具|打扫|交房|开荒|看房' order by checkOutDate",[req.params.enddate,req.params.startdate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length == 0 )
			{
				res.status(501).json(error.NO_RECORD_FOUND);
			}
			else
			{
				res.json(result);
			}
		}
	})
})


router.get('/dailyrents/start/:startdate/end/:enddate',(req,res)=>{
	pool.query("select roomNo,RoomName,hotelNo,hotelName,checkintime,checkouttime,customer,orderNo,rentalType,rentalPerDay,telno,channelName,rentMoney,statusName,orderTypeName,handwork_desc orders where cast(checkintime) <= ? and checkOutDate>= ? and customer NOT REGEXP '维修|装修|准备|无房|投诉|家具|打扫|交房|开荒|看房' order by checkOutDate",[req.params.enddate,req.params.startdate],(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}
		else
		{
			if(result.length == 0 )
			{
				res.status(501).json(error.NO_RECORD_FOUND);
			}
			else
			{
				res.json(result);
			}
		}
	})
})


router.get('/ali/list',(req,res)=>{
	console.log('in');
	alirdspool.query('SELECT contractno  FROM tbl_house',(err,result)=>{
		if(err)
		{
			console.log(err);
			return;
		}
		res.json(result);
	})
})

exports = module.exports = router;

