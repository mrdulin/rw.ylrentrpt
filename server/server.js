var express = require('express');
var app = express();
var route = require('./routes');
var bodyParser = require('body-parser');

app.use(bodyParser());
app.get('/',(req,res) =>{
	res.send('work');
})

app.use(express.static('../www'));

console.log(__dirname);
// app.param('hotelNo',(req,res,next,hotelNo)=>{
// 	req.hotel = hotelNo;
// 	console.log('params:'+hotelNo);
// 	next();
// })
app.use('api/v1/hotel',route.Hotel);
app.use('api/v1/room',route.Room);
app.use('api/v1/order',route.Order);
app.use('api/v1/status',route.Status);

app.listen('3000');
console.log('listen on 3000');