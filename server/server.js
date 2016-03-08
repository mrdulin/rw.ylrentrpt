var express = require('express');
var app = express();
var route = require('./routes');

app.get('/',(req,res) =>{
	res.send('work');
})
// app.param('hotelNo',(req,res,next,hotelNo)=>{
// 	req.hotel = hotelNo;
// 	console.log('params:'+hotelNo);
// 	next();
// })
app.use('/hotel',route.Hotel);
app.use('/room',route.Room);
app.use('/order',route.Order);


app.listen('3000');
console.log('listen on 3000');