var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var alirdspool = require('../service/alimysqlConnect');
var error = require('../error.js')
var moment = require('moment');


/*router.get('/dailyrents/start/:startdate/end/:enddate',(req,res)=>{
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
	
})*/


router.get('/ali/list',(req,res)=>{

	alirdspool.query('SELECT title,cast(`contractno` as signed) as contract FROM tbl_house ORDER BY contract ',(err,result)=>{
		var data = [];
		if(err)
		{
			console.log(err);
			return;
		}
		data.push("开始查找缺少的房源编号");
		for (var i = 0; i < result.length-1; i++) {
				if(!result[i].contract) 
				{
					data.push(result[i].title+"无编号");
				}
				else
				{
					if(result[i+1].contract - result[i].contract > 1)
					{
						
						for(var j=result[i].contract+1;j<result[i+1].contract;j++)
						{
							data.push(j);
						}
					}
					if(result[i+1].contract == result[i].contract )
						data.push("发现重复房源编号"+result[i].contract+result[i].title+result[i+1].title);
				}

		}
		res.json(data).end();
	})
})

router.get('/:id',(req,res)=>{
	alirdspool.query("select os.title as channelName, ch.ispay as payType,ch.cost as rentMoney,ch.startdate as checkintime, ch.enddate as checkouttime,ch.customername as customer, ch.memo as handwork_desc,b.title as hotelName , ch.cost as rentMoney, h.houseno as roomName, ch.customermobile as telno, ch.status, ch.id as orderId from tbl_house_checkin as ch join tbl_house as h on ch.house = h.id join tbl_building as b on h.building = b.id left join tbl_ordersource as os on ch.ordersource = os.id where ch.`id` =?",
		req.params.id,(err,result)=>{
		if(err) {console.log(err);}
		else
		{
			result.map((item)=>{
				var rentalType = '';
				var startdate = moment(item.checkintime);
				var enddate = moment(item.checkouttime);
				var diffmonth = enddate.diff(startdate,'month');
				if(diffmonth==0) rentalType='日租';
				if(diffmonth>0&&diffmonth<=6) rentalType='中短租';
				if(diffmonth>6) rentalType='长租';
				
				item.rentalType = rentalType;

				switch(item.status)
				{
					case '1':
						item.statusName = '已入住';
						break;
					case '0':
						item.statusName = '未入住';
						break;
					case '2':
						item.statusName = '已退房';
						break;	
				};

				switch(item.payType)
				{
					case '1':
						item.payType = '到店现付';
						break;
					case '2':
						item.payType = '已担保';
						break;
					case '3':
						item.payType = '全额支付';
						break;
					case '4':
						item.payType = '部分预付';
						break;	
					default:
						item.payType ='请看备注';

				}

			})
		}
		if(result.length >0){
			res.json(result[0]).end();
		}
		else{
			res.status(404).json({msg:"no record found"});
		}
					
	})
})


//get checkins from production
router.get('/checkins/date/:date',(req,res)=>{
	alirdspool.query("select os.title as channelName, ch.ispay as payType,ch.cost as rentMoney,ch.startdate as checkintime, ch.enddate as checkouttime,ch.customername as customer, ch.memo as handwork_desc,b.title as hotelName , ch.cost as rentMoney, h.houseno as roomName, ch.customermobile as telno, ch.status, ch.id as orderId from tbl_house_checkin as ch join tbl_house as h on ch.house = h.id join tbl_building as b on h.building = b.id left join tbl_ordersource as os on ch.ordersource = os.id where (cast(ch.startdate as date) = ? and ch.status=0) or (cast(ch.checkindate as date) = ? and ch.status=1) or (cast(ch.checkindate as date) = ? and ch.status=2)",
		[req.params.date,req.params.date,req.params.date],(err,result)=>{
		if(err) {console.log(err);}
		else
		{
			result.map((item)=>{
				var rentalType = '';
				var startdate = moment(item.checkintime);
				var enddate = moment(item.checkouttime);
				var diffmonth = enddate.diff(startdate,'month');
				if(diffmonth==0) rentalType='日租';
				if(diffmonth>0&&diffmonth<=6) rentalType='中短租';
				if(diffmonth>6) rentalType='长租';
				
				item.rentalType = rentalType;

				switch(item.status)
				{
					case '1':
						item.statusName = '已入住';
						break;
					case '0':
						item.statusName = '未入住';
						break;
					case '2':
						item.statusName = '已退房';
						break;	
				};

				switch(item.payType)
				{
					case '1':
						item.payType = '到店现付';
						break;
					case '2':
						item.payType = '已担保';
						break;
					case '3':
						item.payType = '全额支付';
						break;
					case '4':
						item.payType = '部分预付';
						break;	
					default:
						item.payType ='请看备注';

				}

			})
		}

		res.json(result).end();
	})
})

//get checkouts from production
router.use('/checkouts/date/:date',(req,res)=>{
	alirdspool.query("select ch.ordersource as channelName, ch.cost as rentMoney,ch.startdate as checkintime, ch.enddate as checkouttime,ch.customername as customer, ch.memo as handwork_desc,b.title as hotelName , ch.cost as rentMoney, h.houseno as roomName, ch.customermobile as telno, ch.status,ch.id from tbl_house_checkin as ch join tbl_house as h on ch.house = h.id join tbl_building as b on h.building = b.id left join tbl_ordersource as os on ch.ordersource = os.id where (cast(ch.enddate as date) = ? and ch.status=0) or (cast(ch.enddate as date) = ? and ch.status=1) or (cast(ch.checkoutdate as date) = ? and ch.status=2)",
		[req.params.date,req.params.date,req.params.date],(err,result)=>{
			
		if(err) {console.log(err);}
		else
		{
			result.map((item)=>{
				var rentalType = '';
				var startdate = moment(item.checkintime);
				var enddate = moment(item.checkouttime);
				var diffmonth = enddate.diff(startdate,'month');
				if(diffmonth==0) rentalType='日租';
				if(diffmonth>0&&diffmonth<=6) rentalType='中短租';
				if(diffmonth>6) rentalType='长租';
				
				item.rentalType = rentalType;

				switch(item.status)
				{
					case '1':
						item.statusName = '已入住';
						break;
					case '0':
						item.statusName = '未入住';
						break;
					case '2':
						item.statusName = '已退房';
						break;	
				};

			})
		}

		res.json(result).end();
	})
})


exports = module.exports = router;

