var express = require('express');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('../model/user');
var OpLog = require('../model/oplog');
var config = require('../config');
var router = express.Router();
var request = require('request');
var app = express();
var moment = require('moment');
var async = require('async');

router.use((req,res,next)=>{
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(401).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
})

router.get('/',(req,res)=>{
	res.send(getLockStatus('d3708c7882d052ff94e3731d9a6c3bce'));
})

router.get('/getDynamicPass/:uuid',(req,res)=>{
	getAccessToken().then((token)=>{
		var queryString = "https://lockapi.dding.net/openapi/v1/get_dynamic_password_plaintext?access_token="+token+"&uuid="+req.params.uuid;
		console.log(queryString);
		request.get(queryString,(error, response, body)=>{
			if(error) {console.log(error);res.json("dding invoke fail");}
			console.log(req.decoded._doc.name);
			var logEntry = new OpLog({ 
				username: req.decoded._doc.name, 
				content: 'get dynamic password',
				datetime: Date().toString(),
				lockuuid: req.params.uuid
			});
			logEntry.save(function(err) {
				if (err) throw err;
				console.log('log saved');
			});
			res.json(JSON.parse(body));
		})
	});
})

router.get('/find/:roomName',(req,res)=>{
	var query = alirdspool.query("SELECT h.`houseno` ,b.`title` ,h.`uuid` from `tbl_house` as h JOIN `tbl_building` as b on h.`building` =b.id WHERE h.`title` like ?",'%'+req.params.roomName+'%',(err,result)=>{
		console.log(query.sql);
		if(err) {console.log(err);}
		else
		{
			result.map((room)=>{
				if(!room.uuid)
					room.isDdingLock = false;
				else
					room.isDdingLock = true;
			})
			res.json(result);
		}
	})
})

function getLockStatus(uuid)
{
	getAccessToken().then((token)=>{
		var queryString = "https://lockapi.dding.net/openapi/v1/get_lock_info?access_token="+token+"&uuid="+req.params.uuid;
		request.get(queryString,(error,response,body)=>{
			if(error) {console.log(error);}
			else
			{
				console.log(JSON.parse(body).onoff_line);
				return JSON.parse(body).onoff_line;
			}
		})
	})
}



function getAccessToken()
{
	return new Promise((resolve, reject) =>{
		if(app.get('ddingToken') && moment() <moment.unix(app.get('ddingToken').expires_time))
		{
			console.log('no need to get token again');
			resolve(app.get('ddingToken').access_token);
		}
		else
		{
			request.post({
			  headers: {'content-type' : 'application/json'},
			  url:     'https://lockapi.dding.net/openapi/v1/access_token',
			  body:    JSON.stringify({client_id:config.ddingClientID,client_secret:config.ddingClientSecret})
			}, (error, response, body)=>{
				if(error) {reject('dding call fail');}
				app.set('ddingToken',JSON.parse(body));
				console.log('set token',JSON.parse(body))
			   resolve(JSON.parse(body).access_token);
			});
		}
	})
}

exports = module.exports = router;