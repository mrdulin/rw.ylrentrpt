var express = require('express');
var app = express();
var route = require('./routes');
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(express.static('../www/dist'));

// app.param('hotelNo',(req,res,next,hotelNo)=>{
// 	req.hotel = hotelNo;
// 	console.log('params:'+hotelNo);
// 	next();
// })
app.use('/api/hotel',route.Hotel);
app.use('/api/room',route.Room);
app.use('/api/order',route.Order);
app.use('/api/status',route.Status);
app.use('/api/update',route.Update);

app.listen('3000');
console.log('listen on 3000');