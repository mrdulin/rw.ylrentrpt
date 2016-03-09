var express = require('express');
var router = express.Router();
var pool = require('../service/mysqlConnect');


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
				if(result.length == 0 ) res.json('no record found');
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
				if(result.length == 0 ) res.json('no record found');
				res.json(result);
			}
		});
})


exports = module.exports = router;
