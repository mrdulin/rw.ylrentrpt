var express = require('express');
var RoomRoute = require('./room');
var router = express.Router();
var pool = require('../service/mysqlConnect');


router.get('/',(req,res)=>{
	//res.send('list');
	pool.query('select * from hotel',(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}

		else
		{
			res.json(result);
		
		}

	});
});


router.get('/:hotelNo',(req,res)=>{
	if(!req.params.hotelNo){res.send('no hotel');return};
	pool.query('select * from hotel where hotelNo = ?',req.params.hotelNo,(err,result)=>{
		if(err)
		{
			console.error(err);
			return;
		}

		else
		{
			if(result.length == 0 ) res.json('no such hotel');
			res.json(result)
		}
	})
})

router.get('/:hotelNo/room',(req,res)=>{
	pool.query('select r.roomName, r.roomNo,r.hasLock,r.hotelNo,h.hotelName,t.roomTypeNo,t.roomTypeName,t.roomTypePrice from room as r join room_type as t on r.roomTypeNo = t.roomTypeNo join hotel as h on r.hotelNo = h.hotelNo where r.hotelNo = ?',
		req.params.hotelNo,(err,result)=>{
			if(err)
			{
				console.error(err);
				return;
			}

			else
			{
				if(result.length == 0 ) res.json('no room found');
				res.json(result);
			}
		}
		)
})

router.use('/:hotelNo/room', RoomRoute);



exports = module.exports = router;

