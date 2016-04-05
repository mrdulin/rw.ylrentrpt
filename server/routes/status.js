var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');
var error = require('../error.js')
var alirdspool = require('../service/alimysqlConnect');
var async = require('async');

//get status summary occupancy rate for all hotels, MAX 90 days
router.get('/start/:startdate/end/:enddate',(req,res) =>{
	pool.query('SELECT hotelName,hotelNo,whichDay as statusDate, emptyRoomCount,outOfOrderRoomCount as oooRoomCount,orderedRoomCount as occupyRoomCount,totalCount as TotalRoomCount from ylrentdb.get_90days_hotel_status_summary where cast(whichDay as date) >= ? and cast(whichDay as date) <= ?',
		[req.params.startdate,req.params.enddate],(err,result)=>{
			if(err)
			{
				console.error(err);
				return;
			}

			else
			{
				//if(result.length == 0 ) res.status(501).json(error.NO_RECORD_FOUND);;
				res.json(result);
			}
		});
})

//get status summary occupancy rate for a specifiy hotel, MAX 90 days
router.get('/hotel/:hotelNo/start/:startdate/end/:enddate',(req,res)=>{
	 pool.query('SELECT hotelName,hotelNo,whichDay as statusDate, emptyRoomCount,outOfOrderRoomCount as oooRoomCount,orderedRoomCount as occupyRoomCount,totalCount as TotalRoomCount from ylrentdb.get_90days_hotel_status_summary where cast(whichDay as date) >= ? and cast(whichDay as date) <= ? and hotelNo = ?',
		[req.params.startdate,req.params.enddate,req.params.hotelNo],(err,result)=>{
			if(err)
			{
				console.error(err);
				return;
			}

			else
			{
				//if(result.length == 0 ) res.status(501).json(error.NO_RECORD_FOUND);;
				res.json(result);
			}
		});
})

//get status summary for production mysql
router.get('/summary/date/:date',(req,res)=>{
	alirdspool.query("select count(*) as totalRooms, b.title as hotel ,b.id as hotelid from tbl_house as h join tbl_building as b on h.building = b.id group by b.id",(err,result)=>{
		var hotellist = [];
		if(err) {console.log(err)}
		else
		{
			async.each(result,

			(item,callback)=>{
				console.log('handling ',item.hotel);
				alirdspool.query("select count(*) as occupyRoomCount from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where b.id = ? and s.housedate=? and s.status!=1",[item.hotelid,req.params.date],(err,result)=>{
					
					if(err) {console.log(err)}
					else
					{
						var emptyRoomCount = 0;
						var oooRoomCount =0;
						emptyRoomCount = item.totalRooms - result[0].occupyRoomCount;
						//console.log(result[0].occupyRoomCount);
						var query = alirdspool.query("select count(*)  as oooRoomCount from tbl_house_status as s join tbl_house as h on s.house =h.id join tbl_building as b on h.building = b.id where b.id = ? and s.housedate=? and s.status not in (1,3,5,6)",[item.hotelid,req.params.date],(err,result)=>{
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


exports = module.exports = router;
