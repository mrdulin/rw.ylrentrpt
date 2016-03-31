var express = require('express');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('../model/user');
var OpLog = require('../model/oplog');
var config = require('../config');
var router = express.Router();
var request = require('request');

router.use((req,res,next)=>{
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
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
	res.send('passRoutes');
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
				console.log(OpLog);
			});
			res.json(JSON.parse(body).password);
		})
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

exports = module.exports = router;