var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var moment = require('moment');
var error = require('../error.js')
var alirdspool = require('../service/alimysqlConnect');
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

router.get('/oooroomdetails/date/:date',(req,res)=>{
	 var query = pool.query("select customer as oooReason, CONCAT_WS(' ',h.hotelName,r.roomName) as roomName from orders as o join room as r on o.roomNo = r.roomNo join hotel as h on r.hotelNo = h.hotelNo where customer Regexp '交房|打扫|家具|装修|维修|长租准备'  and  cast(checkouttime as date) >= ? and cast(checkintime as date) <= ? order by oooreason",
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

//get ooorooms from production 
router.get('/ooorooms/date/:date',(req,res)=>{
	pool.query("select s.status ,b.title as hotelName,h.houseno as roomName from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where s.housedate=? and s.status not in (1,3,5,6)",req.params.date,(err,result)=>{
		if(err) {console.log(err);}
		else
		{
			result.map((item)=>{
				item.oooDate = req.params.date;
				console.log(item.status);
				switch(item.status)
				{
				case '2':
				  item.oooReason = '维修';
				  break;
				case '7':
				  item.oooReason = '装修';
				  break;
				case '8':
				  item.oooReason ='打扫';
				  break;
				case '9':
				  item.oooReason = '交房';
				  break;
				case '10':
				  item.oooReason = '未交房';
				  break;
				case '11':
				  item.oooReason = '未装修';
				  break;
				case '12':
				  item.oooReason = '装修中';
				  break;
				case '13':
				  item.oooReason = '待送家具';
				  break;
				case '14':
				  item.oooReason = '长租准备';
				  break;
				default:
				  item.oooReason = 'not defined status';
				}

			})
			res.json(result).end();
		}
	})
})

//get oooroomdetails from production
router.get('/oooroomdetails/date/:date',(req,res)=>{
	pool.query("select s.status ,concat(b.title,' ',h.houseno) as roomName from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where s.housedate=? and s.status not in (1,3,5,6)",req.params.date,(err,result)=>{
		if(err) {console.log(err);}
		else
		{
			result.map((item)=>{
				item.oooDate = req.params.date;
				console.log(item.status);
				switch(item.status)
				{
				case '2':
				  item.oooReason = '维修';
				  break;
				case '7':
				  item.oooReason = '装修';
				  break;
				case '8':
				  item.oooReason ='打扫';
				  break;
				case '9':
				  item.oooReason = '交房';
				  break;
				case '10':
				  item.oooReason = '未交房';
				  break;
				case '11':
				  item.oooReason = '未装修';
				  break;
				case '12':
				  item.oooReason = '装修中';
				  break;
				case '13':
				  item.oooReason = '待送家具';
				  break;
				case '14':
				  item.oooReason = '长租准备';
				  break;
				default:
				  item.oooReason = 'not defined status';
				}

			})
			res.json(result).end();
		}
	})
})

exports = module.exports = router;
