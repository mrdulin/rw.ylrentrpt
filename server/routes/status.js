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

router.get('/test',(req,res)=>{
	var roomList = [];
	getHotels().then(result=>{
		genereateSummary(result);
	});

})



function getHotels() {
	return new Promise((resolve,reject)=>{

		alirdspool.query("select id,title from tbl_building",(err,result)=>{
			if(err)
			{
				console.log(err);
			}
			else
			{
				return resolve(result);
			}
		})
	})
}

function getRoomCount(hotelid){
	alirdspool.query("select count(*) as total from tbl_house where building = ?",hotelid,function(err,result){
		var totalCount = 0;
		var 
		if(err) console.log(err);
		else
		{
			console.log(result);
		}
		//pool.query("select * ")
	})

	//console.log('query ',hotelNo);
}



function genereateSummary(result)
{
	var counter = 0;
	console.log("result length ",result.length );
	async.whilst(
		()=>{return counter<result.length},
		(callback)=>{
			getRoomCount(result[counter].id);
			counter++;
			callback(null);
			
		},
		(err)=>{
		if(err)
			console.log(err);
		}
	)
}


exports = module.exports = router;
