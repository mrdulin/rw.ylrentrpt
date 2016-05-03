var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('HotelSummary', new Schema({ 
	summaryDate: String, 
	oOORoomCount: Number,
	totalRoomCount: Number,
	totalOccupyRoomCounts: Number,
	occupancyRate: Number 
}));