var Mongoose = require('mongoose')
, Schema = Mongoose.Schema;

var dateable = require('dateable');

var extras = require('../helpers/extras.js');
var models = require('../models/energy.js');
var buildings = require('../models/buildings.js');
var userInterface = require('../models/interface.js');
var competitions = require('../models/competitions.js');
var energy = require('./energy.js');



var dataHour = Mongoose.model('dataHour');
var dataDaily = Mongoose.model('dataDaily');
var dataMonthly = Mongoose.model('dataMonthly');
var Buildings = Mongoose.model('buildings');



function baseConsumption(building, baseStart, diffDays, callback) {
	Buildings.find({name: building}, function(err, res){
		// console.log(diffDays)
		var to = new Date(baseStart);
		to.setDate(baseStart.getDate() + diffDays);
		console.log("to:",to);
		dataHour.find({code: res[0].code, date: {$gte: baseStart, $lte: to}}, function(errors, results) {
			total = 0;
			for (var i = 0; i < results.length; i++) {
				total += results[i].value;
			};
			console.log("Base: " + res[0].code, total, baseStart, to);
			callback(total);
		});
	});
}

function activeConsumption(building, startDate, callback) {
	var today = new Date();
	Buildings.find({name: building}, function(err, res){
		console.log(res[0].code, err)
		dataHour.find({code: res[0].code, date: {$gte: startDate, $lte: today}}, function(errors, results) {
			total = 0;
			for (var i = 0; i < results.length; i++) {
				total += results[i].value;
			};
			console.log("active: " + res[0].code, total, startDate, today);
			callback(total);
		});
	});
}

function buildingScore(building, startDate, baseStart, baseEnd, callback) {
	var today = new Date();
	var timeDiff = Math.abs(today.getTime() - startDate.getTime());
	var diffDays = Math.ceil((timeDiff) / (1000 * 3600 * 24));
	console.log("Time Difference: ", diffDays);
	baseConsumption(building, baseStart, (diffDays-1), function(base){
		activeConsumption(building, startDate, function(active) {
			var d = base - active;
			var score = Math.round(((d/base) * 100) * 100) / 100;
			console.log("THIS: ", base, active);
			console.log("SCORE: ", score);
			callback(score, building);
		});
	});
}

var getBuildingsConsumption = function(data) {
	// console.log(data.buildings, data.startDate, data.baseStart);
	var collectedData = [];
	for (var i = 0; i < data.buildings.length; i++) {
		buildingScore(data.buildings[i].name, data.startDate, data.baseStart, data.baseEnd,
			function(resultScore, building){
			
			competitions.competitionsModel.findOne({code: data.code}, 
				function(err, res){
					for (var i = 0; i < res.buildings.length; i++) {
					 	if (res.buildings[i].name === building)
					 		res.buildings[i].score = resultScore;
					};
					res.save(function(err) {
						console.log(err);
					});
				});
		});
	};
	
}

var updateScores = function(data) {
	for (var i = 0; i < data.length; i++) {
		getBuildingsConsumption(data[i]);
	};	
}
// update competitions from new to inBase if base period starts   
var updateInBasePeriod = function() {
	var today = new Date();
	competitions.competitionsModel.find({status: "new"}, function(err, data) {
   	// console.log(data);
   	for(var i = 0; i < data.length; i++) {
			if (data[i].baseStart.getDate() === today.getDate() &&
				data[i].baseStart.getMonth() === today.getMonth() &&
				data[i].baseStart.getFullYear() === today.getFullYear() &&
				today.getHours() == 1) {

				competitions.competitionsModel.update(
					{ code: data[i].code },
					{ status: "inBase"},
					{ upsert: true }, 
					function(err, results){
						console.log("changed to inBase period");
					}
				);
				console.log("Detected a new competition in Base period");
			}
		}	
  });
	
  console.log("in updateInBasePeriod Func");
}

var updateInPendingPeriod = function() {
	var today = new Date();
	competitions.competitionsModel.find({status: "inBase"}, function(err, data) {
   	// console.log(data);
   	for(var i = 0; i < data.length; i++) {
			if (data[i].baseEnd.getDate() === today.getDate() &&
				data[i].baseEnd.getMonth() === today.getMonth() &&
				data[i].baseEnd.getFullYear() === today.getFullYear() &&
				today.getHours() == 23) {

				competitions.competitionsModel.update(
					{ code: data[i].code },
					{ status: "pendingStart"},
					{ upsert: true }, 
					function(err, results){
						console.log("changed to pending start status");
					}
				);
				console.log("Detected a new competition in pending start status");
			}
		}	
  });
	
  console.log("in updateInPendingPeriod Func");
}

var updateInActivePeriod = function() {
	var today = new Date();
	competitions.competitionsModel.find({status: "pendingStart"}, function(err, data) {
   	// console.log(data);
   	for(var i = 0; i < data.length; i++) {
			if (data[i].startDate.getDate() === today.getDate() &&
				data[i].startDate.getMonth() === today.getMonth() &&
				data[i].startDate.getFullYear() === today.getFullYear() &&
				today.getHours() == 1) {

				competitions.competitionsModel.update(
					{ code: data[i].code },
					{ status: "active"},
					{ upsert: true }, 
					function(err, results){
						console.log("changed to active status");
					}
				);
				console.log("Detected a new competition in active status");
			}
		}	
  });
	
  console.log("in updateInActivePeriod Func");
}

var updateBuildingsScores = function() {
	
	competitions.competitionsModel.find({status: "active"}, function(err, data) {
		updateScores(data);
  });
	
  console.log("in updateBuildingsScores Func");
}

var updateCompletedCompetitions = function() {
	var today = new Date();
	competitions.competitionsModel.find({status: "active"}, function(err, data) {
   	// console.log(data);
   	for(var i = 0; i < data.length; i++) {
			if (data[i].endDate.getDate() === today.getDate() &&
				data[i].endDate.getMonth() === today.getMonth() &&
				data[i].endDate.getFullYear() === today.getFullYear() &&
				today.getHours() == 23) {

				competitions.competitionsModel.update(
					{ code: data[i].code },
					{ status: "done"},
					{ upsert: true }, 
					function(err, results){
						console.log("changed to pending start period");
					}
				);
				console.log("Detected a new competition in pending start period");
			}
		}	
  });
	
  console.log("in updateCompletedCompetitions Func");
}

module.exports.updateInBasePeriod = updateInBasePeriod; 
module.exports.updateInPendingPeriod = updateInPendingPeriod; 
module.exports.updateInActivePeriod = updateInActivePeriod; 
module.exports.updateCompletedCompetitions = updateCompletedCompetitions; 
module.exports.updateBuildingsScores = updateBuildingsScores; 
