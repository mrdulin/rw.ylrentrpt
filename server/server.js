var express = require('express');
var app = express();
var route = require('./routes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var request = require('request');

mongoose.connect(config.database);
app.use(bodyParser());
app.use(express.static('../www/dist'));

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Tokens');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); 
  }
  else {
    next();
  }
});


// app.param('hotelNo',(req,res,next,hotelNo)=>{
//     req.hotel = hotelNo;
//     console.log('params:'+hotelNo);
//     next();
// })
app.use('/api/hotel', route.Hotel);
app.use('/api/room', route.Room);
app.use('/api/order', route.Order);
app.use('/api/status', route.Status);
app.use('/api/update', route.Update);

passRoutes = express.Router();


app.get('/createuser', (req, res) => {


})


function getAccessToken() {
    return new Promise((resolve, reject) => {
        request.post({
            headers: {
                'content-type': 'application/json'
            },
            url: 'https://lockapi.dding.net/openapi/v1/access_token',
            body: JSON.stringify({
                client_id: config.ddingClientID,
                client_secret: config.ddingClientSecret
            })
        }, (error, response, body) => {
            if (error) {
                reject('dding call fail');
            }
            console.log(JSON.parse(body).access_token);
            resolve(JSON.parse(body).access_token);
        });
    })
}


app.post('/authenticate', (req, res) => {
    User.findOne({
        name: req.body.name
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: '不存在此用户'
            });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({
                    success: false,
                    message: '密码或者用户名错误'
                });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 864000 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'token for ' + user.name,
                    token: token
                });
            }

        }

    });
})


app.post('/getAppToken', (req, res) => {
    console.log(req.body.appID,req.body.appSecret);
    if(req.body.appID&&req.body.appSecret){
            if(req.body.appID == config.appID && req.body.appSecret == config.appSecret){
                    var token = jwt.sign({appName:"web App YLReborn"},config.secret);
                    res.json({
                        success: true,
                        message: 'token for application',
                        token: token
                    });
            }
            else{
                res.status(401).json('need appid or appSecret');
            }
    }
    else{
        res.status(401).json('need appid or appSecret');
    }
})


app.use('/pass', route.DdingPass);

app.listen('3000');
console.log('listen on 3000');
