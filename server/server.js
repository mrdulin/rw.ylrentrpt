var express = require('express');
var app = express();
var route = require('./routes');
var bodyParser = require('body-parser');
var mongoose    = require('mongoose');
var User   = require('./model/user');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var request = require('request');

mongoose.connect(config.database);
app.use(bodyParser());
app.use(express.static('../www/dist'));

// app.param('hotelNo',(req,res,next,hotelNo)=>{
//     req.hotel = hotelNo;
//     console.log('params:'+hotelNo);
//     next();
// })
app.use('/api/hotel',route.Hotel);
app.use('/api/room',route.Room);
app.use('/api/order',route.Order);
app.use('/api/status',route.Status);
app.use('/api/update',route.Update);

passRoutes = express.Router();


app.get('/createUser',(req,res)=>{


    /*request.post({
      headers: {'content-type' : 'application/json'},
      url:     'https://lockapi.dding.net/openapi/v1/access_token',
      body:    JSON.stringify({client_id:"a9db4c60128af57be8cf1dbf",client_secret:"d6f7ab85b83e900154f4bcc85103e533"})
    }, function(error, response, body){
      console.log(JSON.parse(body).access_token);
      res.send(body);
    });*/

    // getAccessToken().then((token)=>{
    //     var queryString = "https://lockapi.dding.net/openapi/v1/get_dynamic_password_plaintext?access_token="+token+"&uuid="+"d6ba8716926fb8af86b14f47dc53e697";
    //     console.log(queryString);
    //     request.get(queryString,(error, response, body)=>{
    //         res.send(body);
    //     })
    // });

    var user = new User({
        name: 'dulin',
        password: 'password',
        admin: true
    });
    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

app.get('/getddingtoken',(req,res)=>{


    /*request.post({
      headers: {'content-type' : 'application/json'},
      url:     'https://lockapi.dding.net/openapi/v1/access_token',
      body:    JSON.stringify({client_id:"a9db4c60128af57be8cf1dbf",client_secret:"d6f7ab85b83e900154f4bcc85103e533"})
    }, function(error, response, body){
      console.log(JSON.parse(body).access_token);
      res.send(body);
    });*/
/*
    getAccessToken().then((token)=>{
        var queryString = "https://lockapi.dding.net/openapi/v1/get_dynamic_password_plaintext?access_token="+token+"&uuid="+"d6ba8716926fb8af86b14f47dc53e697";
        console.log(queryString);
        request.get(queryString,(error, response, body)=>{
            res.send(body);
        })
    });*/

    var helen = new User({
        name: 'helen',
        password: 'Abcd1234',
        admin: true
    });
    helen.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });


    var zyg = new User({
        name: 'zyg',
        password: 'Abcd1234',
        admin: true
    });
    zyg.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });


})


function getAccessToken()
{
    return new Promise((resolve, reject) =>{
        request.post({
          headers: {'content-type' : 'application/json'},
          url:     'https://lockapi.dding.net/openapi/v1/access_token',
          body:    JSON.stringify({client_id:config.ddingClientID,client_secret:config.ddingClientSecret})
        }, (error, response, body)=>{
            if(error) {reject('dding call fail');}
          console.log(JSON.parse(body).access_token);
           resolve(JSON.parse(body).access_token);
        });
    })
}


app.post('/authenticate',(req,res)=>{
    User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'token for '+user.name,
                        token: token
                    });
                }

            }

        });
})


app.use('/pass', route.DdingPass);

app.listen('3000');
console.log('listen on 3000');
