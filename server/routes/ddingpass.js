var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('../model/user');
var OpLog = require('../model/oplog');
var config = require('../config');
var router = express.Router();
var request = require('request');
var app = express();
var moment = require('moment');
var async = require('async');
var alirdspool = require('../service/alimysqlConnect');
var random = require("random-js")();

//require('request-debug')(request);  //http request debug

router.use((req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
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

router.post('/addpass', (req, res) => {
    if (req.body.cellphone && req.body.starttime && req.body.addtype && req.body.name && req.body.uuid && req.body.span) {
        var password = getRandomPassword();
        var starttim, e, endtime = {};
        //1 means add hours
        if (req.body.addtype == 1) {
            starttime = moment(req.body.starttime);
            endtime = moment(req.body.starttime).add(req.body.span, 'hour');
        }
        if (req.body.addtype == 2) {
            starttime = moment(req.body.starttime);
            endtime = moment([starttime.year(), starttime.month(), starttime.date()]).add(req.body.span, 'day').add(12, 'hour');
        }

        getAccessToken().then((token) => {
            request.post({
                headers: {
                    'content-type': 'application/json'
                },
                url: 'https://lockapi.dding.net/openapi/v1/add_password',
                body: JSON.stringify({
                    "uuid": req.body.uuid,
                    "phonenumber": req.body.cellphone,
                    "is_default": 0,
                    "password": password,
                    "name": req.body.name,
                    "permission_begin": starttime.unix(),
                    "permission_end": endtime.unix(),
                    "access_token": token
                })
            }, (error, response, body) => {
                if (error) res.status(503).json(JSON.parse(body));
                else {
                    var result = JSON.parse(body);
                    if (result.ErrNo == 0) {
                        var logEntry = new OpLog({
                            username: req.decoded._doc.name,
                            content: 'send time password',
                            datetime: Date(),
                            lockuuid: req.body.uuid,
                            starttime: starttime,
                            endtime: endtime,
                            cellphone: req.body.cellphone,
                            name: req.body.name,
                            passwordId: result.id
                        });
                        logEntry.save(function (err) {
                            if (err) throw err;
                            console.log('log saved');
                        });

                        result.starttime = starttime.toString();
                        result.endtime = endtime.toString();
                        res.json(result);
                    } else {
                        res.status(503).json(result);
                    }
                }
            })
        })
    } else {
        res.status(503).json({
            msg: 'http request fail'
        });
    }
})

router.get('/getDynamicPass/:uuid', (req, res) => {
    getAccessToken().then((token) => {
        var queryString = "https://lockapi.dding.net/openapi/v1/get_dynamic_password_plaintext?access_token=" + token + "&uuid=" + req.params.uuid;
        console.log(queryString);
        request.get(queryString, (error, response, body) => {
            if (error) {
                console.log(error);
                res.json("dding invoke fail");
            }
            var logEntry = new OpLog({
                username: req.decoded._doc.name,
                content: 'get dynamic password',
                datetime: Date(),
                lockuuid: req.params.uuid
            });
            logEntry.save(function (err) {
                if (err) throw err;
                console.log('log saved');
            });
            res.json(JSON.parse(body));
        })
    });
})

router.get('/find/:roomName', (req, res) => {
    alirdspool.query("SELECT h.`houseno` ,b.`title` ,h.`uuid` from `tbl_house` as h JOIN `tbl_building` as b on h.`building` =b.id WHERE h.`title` like ?", '%' + req.params.roomName + '%', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.map((room) => {
                if (!room.uuid)
                    room.isDdingLock = false;
                else
                    room.isDdingLock = true;
            });
            async.each(result, (item, callback) => {
                    getLockStatus(item, callback);

                }, (err) => {
                    res.json(result);
                })
                //res.json(result);
        }
    })
})



function getLockStatus(item, callback) {
    //return new Promise((resolve,reject)=>{
    if (!item.isDdingLock) {
        item.lockStatus = 999; //无丁盯门锁
        callback();
        return;
    }
    getAccessToken().then((token) => {
            var queryString = "https://lockapi.dding.net/openapi/v1/get_lock_info?access_token=" + token + "&uuid=" + item.uuid;
            console.log(queryString);
            request.get(queryString, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(item.uuid, '  ', JSON.parse(body).onoff_line);
                    item.lockStatus = JSON.parse(body).onoff_line;
                    callback();
                    //return(JSON.parse(body).onoff_line);
                    //resolve(JSON.parse(body).onoff_line);
                }
            })
        })
        //})
}



function getAccessToken() {
    return new Promise((resolve, reject) => {
        if (app.get('ddingToken') && moment() < moment.unix(app.get('ddingToken').expires_time)) {
            console.log('no need to get token again');
            resolve(app.get('ddingToken').access_token);
        } else {
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
                app.set('ddingToken', JSON.parse(body));
                console.log('set token', JSON.parse(body))
                resolve(JSON.parse(body).access_token);
            });
        }
    })
}

function addDdingPassword(uuid, cellphone, name, starttime, endtime) {
    getAccessToken().then((token) => {
        return new Promise((resolve, reject) => {
            request.post({
                headers: {
                    'content-type': 'application/json'
                },
                url: 'https://lockapi.dding.net/openapi/v1/add_password',
                body: JSON.stringify({
                    uuid: uuid,
                    phonenumber: cellphone,
                    password: "332122",
                    name: name,
                    permission_begin: starttime,
                    permission_end: endtime,
                    access_token: token
                })
            }, (error, response, body) => {
                if (error) reject(JSON.parse(body));
                else
                    resolve(JSON.parse(body));
            })
        })
    })
}

function getRandomPassword() {
    var password = '';
    for (var i = 0; i < 6; i++) {
        var value = random.integer(1, 9).toString();
        password += value;
    }
    return password;
}

exports = module.exports = router;
