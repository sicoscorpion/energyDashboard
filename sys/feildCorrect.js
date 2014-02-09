var express = require('express')
   , Mongoose = require('mongoose')
   , Schema = Mongoose.Schema
   , app = express();

var collections = ["dataHour", "dataDaily"];

var db = require('mongojs').connect('dashboard', collections);

require('./extras');
console.log( new Date("2013-02-10"));
db.dataDaily.find({code:"UNH", date: new Date("02/05/2014")}, function(res, err) {
	console.log(res, err);
});

// db.dataDaily.find().forEach(function(err, elem) {
// 	if (elem){
// 		// console.log(elem.date);
// 		elem.date = new Date(elem.date);
// 		db.dataDaily.save(elem);
// 	}
// 	console.log("DONE!")
	
// });