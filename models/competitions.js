var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var competitionsModel = Mongoose.model("competitions", new Schema({
    competition : {
    	code 		: Number,
    	name		: String,
    	startDate	: Date,
    	endDate		: Date,
    	baseStart	: Date,
    	baseEnd		: Date,
    	buildings	: Array,
    	status		: String, // in base week, active, done
    },
    score : {
    	compCode	: Number,
    	building 	: String,
    	rank		: Number,
    	value		: Number, 
    }
}, {collection  : "competitions"}));

exports.competitionsModel = competitionsModel;