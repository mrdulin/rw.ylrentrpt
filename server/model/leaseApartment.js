var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
// set up a mongoose model

var schema = new Schema({ 
	id: String, 
	houseno: String,
	contractno: String,
	ting:Number,
	shi:Number,
	wei:Number,
	costmonth:Number,
	address:String,
	community:String,
	leased:Boolean,
	communityID:String
}, {
  versionKey: false,
  timestamps:true
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('leaseApartment', schema);

