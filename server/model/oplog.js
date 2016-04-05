var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('OpLog', new Schema({ 
	username: String, 
	content: String,
	datetime: Date,
	lockuuid:String,
	starttime:Date,
	endtime:Date,
	cellphone:String,
	name:String,
	passwordId:String
}));