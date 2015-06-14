var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var competitionsModel = Mongoose.model("competitions", new Schema({
	code 		: { type: Number, index: { unique: true } },
	name		: String,
	startDate	: Date,
	endDate		: Date,
	baseStart	: Date,
	baseEnd		: Date,
	buildings	: [{
		name: String,
		score: { type: Number, default: 0 },
	}],
	status		: String, // in base week, active, done
}, {collection  : "Competitions"}));

exports.competitionsModel = competitionsModel;