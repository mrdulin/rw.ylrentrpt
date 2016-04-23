var express = require('express');
var router = express.Router();
var error = require('../error.js');
var Apartment = require('../model/apartment');

router.get('/',(req,res)=>{
	var appartmentItem = new Apartment({
	    apartmentName: '7-1013',
	    hotelName: '东方曼哈顿',
	    contractNo: 211,
	    currentStatus: 5,
	    //comment:[String],
	    departmentInCharge:'工程部'
	});
	appartmentItem.save(function (err) {
	    if (err) throw err;
	    console.log('saved');
	    res.send(appartmentItem);
	});
})


exports = module.exports = router;
