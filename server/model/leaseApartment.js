var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('leaseApartment', new Schema({ 
	houseid: String, 
	houseno: String,
	contractno: String,
	ting:Number,
	shi:Number,
	wei:Number,
	costmonth:Number,
	address:String,
	community:String,
	leased:Boolean
}, {
  versionKey: false,
  timestamps:true
}));

