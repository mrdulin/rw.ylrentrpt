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
			
				res.json(result);
			
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

			res.json(result);
			
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

				res.json(result);
		
		}
	})
})


router.get('/dailyrents/start/:startdate/end/:enddate',(req,res)=>{
	var contractnoList = [];
	alirdspool.query('SELECT title,contractno  FROM tbl_house',(err,result)=>{
		if(err)
		{
			console.log(err);
			return;
		}
		contractnoList = result;
		pool.query("select o.roomNo,r.RoomName as roomName,h.hotelNo,h.hotelName as hotelName,o.checkintime,o.checkouttime,o.customer,o.orderNo,o.rentalType,o.telno,o.channelName,o.rentMoney,o.statusName,o.orderTypeName,o.handwork_desc from orders o join room r on o.roomNo = r.roomNo join hotel h on r.hotelNo = h.hotelNo  where customer not Regexp('维修|装修|准备|无房|投诉|家具|打扫|交房|开荒|看房') and cast(checkintime as date) >=? and cast(checkintime as date)<=? order by o.checkintime",[req.params.startdate,req.params.enddate],(err1,result1)=>{

			if(err1)
			{
				console.error(err);
				return;
			}
			else
			{
				result1.map((row)=>{
					var found = contractnoList.find((item)=>{
						return item.title.replace(' ','') == row.hotelName+row.roomName;
					});
					if(found)
					{
						row["contractno"] = found.contractno;
					}
					else
					{
						console.log('not found contractno for',row.hotelName+row.roomName);
					}
				})
				
			}
			res.send(result1).end();
		})

	});
	//console.log(contractnoList);
	
})


router.get('/ali/list',(req,res)=>{
	var contractnoList = [];
	alirdspool.query('SELECT title,contractno  FROM tbl_house',(err,result)=>{
		if(err)
		{
			console.log(err);
			return;
		}
		contractnoList = result;
	})
})

exports = module.exports = router;

