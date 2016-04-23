var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var statusHistorySchema = new Schema({
  contractNo: String,
  currentStatus: Number,
  previousStatus: Number,
  //comment:[String],
  operator:String,
  comment:String

}, {
  versionKey: false,
  timestamps:true
});

var appartmentSchema = new Schema({
  apartmentName: String,
  hotelName: String,
  contractNo:String,
  currentStatus: Number,
  history:[statusHistorySchema],
  departmentInCharge:String

}, {
  versionKey: false,
  timestamps:true
});



module.exports = mongoose.model('Apartment',appartmentSchema);