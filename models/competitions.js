var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var competitionsModel = Mongoose.model("competitions", new Schema({
	code 		: Number,
	name		: String,
	startDate	: Date,
	endDate		: Date,
	baseStart	: Date,
	baseEnd		: Date,
	buildings	: Array,
	status		: String, // in base week, active, done
}, {collection  : "Competitions"}));

exports.competitionsModel = competitionsModel;