var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var error = require('../error.js')
var alirdspool = require('../service/alimysqlConnect');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

//get status summary for production mysql
router.get('/summary/date/:date',(req,res)=>{
	alirdspool.query("select count(*) as totalRooms, b.title as hotel ,b.id as hotelid from tbl_house as h join tbl_building as b on h.building = b.id where  h.isdel!=0 group by b.id ",(err,result)=>{
		var hotellist = [];
		if(err) {console.log(err);res.status(500).json(err);return;}
		else
		{
			async.each(result,

			(item,callback)=>{
				alirdspool.query("select count(*) as occupyRoomCount from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where b.id = ? and s.housedate=? and s.status!=1 and  h.isdel!=0 ",[item.hotelid,req.params.date],(err,result)=>{
					
					if(err) {console.log(err)}
					else
					{
						var emptyRoomCount = 0;
						var oooRoomCount =0;
						emptyRoomCount = item.totalRooms - result[0].occupyRoomCount;
						//console.log(result[0].occupyRoomCount);
						var query = alirdspool.query("select count(*)  as oooRoomCount from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where b.id = ? and s.housedate=? and s.status not in (1,3,5,6) and  h.isdel!=0",[item.hotelid,req.params.date],(err,result)=>{
							if(err) {console.log(err)}
								else
								{
									
									oooRoomCount = result[0].oooRoomCount;
									hotellist.push({
										'emptyRoomCount':emptyRoomCount,
										'oooRoomCount':oooRoomCount,
										'TotalRoomCount':item.totalRooms,
										'hotelName':item.hotel,
										'occupyRoomCount':item.totalRooms-emptyRoomCount-oooRoomCount,
										'statusDate':req.params.date
										});
									callback();
								}
						})

						
						
					}
				})
			},

			(err)=>{
				if(err) {console.log(err);};
				res.json(hotellist);
			})
		}
	})
})

router.get('/decoration',(req,res)=>{
	alirdspool.query('SELECT h.`title` ,s.`status`,s.`housedate` ,COUNT(*) as days ,s.`operator`,h.`id`  FROM `tbl_house_status` as s join `tbl_house` as h on s.`house` =h.`id`  where s.`status` = 12 and s.`housedate` <= NOW() GROUP BY h.`title` ',(err,result)=>{
		if(err) {console.log(err)}
			else
			{
				result.map((item)=>{
					if(moment(item.housedate).add(item.days-1,'day').format('YYYY-MM-DD') < moment().format('YYYY-MM-DD'))
						item.progress = "已完工";
					else
						item.progress = "未完工";
				})

				res.send(result);
			}
	})
})

//get the room status for the a specified room contrat number
router.post('/',(req,res)=>{
	if(!req.body.rooms){res.json("no info").end();return;}
	var queryrooms = _.join(req.body.rooms,',');
	var statusList = [];
	alirdspool.query("select h.`contractno`,s.`status`  FROM `tbl_house` as h  left JOIN `tbl_house_status` as s on h.`id` = s.`house`  WHERE s.`housedate` = CURDATE() and h.`contractno` in ("+queryrooms+")",(err,result)=>{
		req.body.rooms.map((item)=>{
			 var found = _.find(result,(i)=>{
				return i.contractno == item;
			});
		
			if(found)
			{
				switch(found.status)
				{
				case '1':
					found.statusName = '空房';
					break;
				case '2':
				  found.statusName = '维修';
				  break;
				case '3':
					found.statusName = '在住';
					break;
				case '4':
					found.statusName = '锁房';
					break;
				case '5':
					found.statusName = '预抵';
					break;
				case '7':
				  found.statusName  = '装修';
				  break;
				case '8':
				  found.statusName  ='打扫';
				  break;
				case '9':
				  found.statusName  = '交房';
				  break;
				case '10':
				  found.statusName  = '未交房';
				  break;
				case '11':
				  found.statusName  = '未装修';
				  break;
				case '12':
				  found.statusName  = '装修中';
				  break;
				case '13':
				  found.statusName  = '待送家具';
				  break;
				case '14':
				  found.statusName  = '长租准备';
				  break;
				default:
				  found.statusName  = 'not defined status';
				}
				statusList.push(found);
			}
			else
			{
				statusList.push({contractno:item.contractno,status:1,statusName:"空房"});
			}
		});
		
		
		alirdspool.query("select keystatus as lockType, contractno, title FROM `tbl_house` where contractno in ("+queryrooms+")",(err,result)=>{
			if(err){
				res.status(500).json(err);
			}
			else{
				result.map((item)=>{
					console.log(item);
					_.find(statusList,(o)=>{
						return o.contractno == item.contractno;
					}).lockType = item.lockType;
				})
				res.json(statusList);
			}
		})
		
	})
})


// get the room status for the house within a specific period 
router.get('/contractno/:contractno/start/:startdate/end/:enddate',(req,res)=>{
	alirdspool.query("select h.`houseno` ,h.`contractno` ,s.`status` ,s.`orderno` ,ch.`startdate` ,DATE( DATE_SUB( ch.`enddate`  , INTERVAL 1 DAY ) ) as enddate ,ch.`memo` ,ch.`checkindate` ,ch.customername,ch.`checkoutdate`,os.title as channelName  from `tbl_house_status` as s join `tbl_house_checkin` as ch on s.`orderno` = ch.`checkno` join tbl_house as h on s.`house` = h.`id` join tbl_ordersource as os on ch.ordersource = os.id where h.`contractno` = ? and (s.`housedate`  BETWEEN ? and ?) GROUP BY s.`orderno` ORDER BY ch.`startdate`  ",
		[req.params.contractno,req.params.startdate,req.params.enddate],
		(err,result)=>{
			if(err){
				console.log(err);
				res.status(500).json(err).end();
				return;
			}
			else{
				result.map((item)=>{
					if(item.checkindate){
						item.startdate = item.checkindate;
					}
					if(item.checkoutdate){
						item.enddate = item.checkoutdate;
					}
				});

				var orderStatusList = result;
				//get non-order related status
				alirdspool.query("SELECT h.`houseno` ,h.`contractno` ,s.`status`,s.`status`, s.`housedate` as startdate,s.`housedate` as enddate from `tbl_house_status` as s join `tbl_house` as h on s.`house` =h.`id` WHERE h.`contractno` = 493 and s.orderno is NULL and (s.`housedate`  BETWEEN '2016-4-20' and '2016-5-23')",
					(err,result)=>{
						if(err){
							console.log(err);
							res.status(500).json(err).end();
							return;
						}
						else{
							result.map((item)=>{
								item.memo = item.channelName = item.orderno = null;
								//item.startdate = item.enddate = moment(item.startdate).format('YYYY-MM-DD');
							})
							result = result.concat(orderStatusList);
							result.map((item)=>{
								if(item.status == 1){
									result.splice(item);
									//continue;
								}
								switch(item.status)
								{
								case '2':
								  item.statusName = '维修';
								  break;
								case '3':
								  item.statusName = '在住';
								  break;
								case '0':
								  item.statusName = '已退房';
								  break;
								case '5':
								  item.statusName = '已预定';
								  break;
								case '7':
								  item.statusName = '装修';
								  break;
								case '8':
								  item.statusName ='开荒打扫';
								  break;
								case '9':
								  item.statusName = '交房';
								  break;
								case '10':
								  item.statusName = '未交房';
								  break;
								case '11':
								  item.statusName = '未装修';
								  break;
								case '12':
								  item.statusName = '装修中';
								  break;
								case '13':
								  item.statusName = '待送家具';
								  break;
								case '14':
								  item.statusName = '长租准备';
								  break;
								 case '15':
								   item.statusName = '保洁';
								   break;
								default:
								  item.oooReason = '未定义房态';
								}
							})

							res.json(_.orderBy(result,'startdate'));
						}
				})	

				
			}
	})
})

router.get('/test/:contractno',(req,res)=>{
	alirdspool.query("select s.`status` ,ch.`startdate` ,ch.`enddate` ,ch.`checkindate` , ch.`checkoutdate` , ch.`ordersource` ,h.`title` ,h.`contractno` from `tbl_house_status` as s JOIN `tbl_house_checkin` as ch on s.`orderno` = ch.`checkno` join tbl_house as h on s.`house` = h.`id`  where h.`contractno` = ?  and s.`housedate` > NOW() and (s.`status` in (3,5)) GROUP BY s.`orderno`",
			req.params.contractno,
			(err,result)=>{
				if(err){
					res.status(500).json(err);
				}
				else{
					res.json(CheckifReadyforLeasing(result));
				}

			}
		)
})

router.get('/test',(req,res)=>{
	console.log('in...');
	alirdspool.query("select id,title,contractno from tbl_house where isdel = 1",(err,result1)=>{
		if(err){
			res.status(500).json(err);
		}
		else{
			async.each(result1,
			(item,callback)=>{
				alirdspool.query("select s.`status` ,ch.`startdate` ,ch.`enddate` ,ch.`checkindate` , ch.`checkoutdate` , ch.`ordersource` ,h.`title` ,h.`contractno` from `tbl_house_status` as s JOIN `tbl_house_checkin` as ch on s.`orderno` = ch.`checkno` join tbl_house as h on s.`house` = h.`id`  where h.`id` = ?  and s.`housedate` > NOW() and (s.`status` in (3,5)) GROUP BY s.`orderno`",
				item.id,
				(err,result)=>{
					item.lease = CheckifReadyforLeasing(result);
					callback();
				});
			},
			(err)=>{
				if(err){
					res.status(500).json(err);
				}
				res.json(result1);
			}

			)
		}
	})
})

function CheckifReadyforLeasing(result) {
	//console.log(result);
	var lease = result.map((item)=>{
		forleasing = true;
		var startdate = moment(item.startdate);
		var enddate = moment(item.enddate);
		var now = moment();
		// if the order is in progress
		if(now > startdate && now < enddate){
			// if order still have 60 days to finish, consider as not available for leasing
			if(enddate.diff(now,'days') > 60 ){
				return {leasing:'长租已租',start:item.startdate,end:item.enddate};
			}
		}
		// order is not in progress yet
		else{
			// if order dates is more than 90 days or order source is 长租 
			if(enddate.diff(startdate,'days') > 90 || item.ordersource == 19){
				return {leasing:'长租已租',start:item.startdate,end:item.enddate};
			}
		}
	});
	if(lease.length > 0){
		return lease[0];
	}
	else{
		return {leasing:'可租'}
	}
}


exports = module.exports = router;
