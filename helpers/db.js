var mongoose = require('mongoose')
exports.mongoose = mongoose;
var config = require('../config.json');

var uristring = 
	process.env.MONGOLAB_URI || 
	process.env.MONGOHQ_URL || 
	config.db_address;

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
	if (err) { 
		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + uristring);
	}
});