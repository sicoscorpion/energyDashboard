/* 
	Handle the Parsed & calculated data and set conditions for when they should be stored
   	TODO usage
*/

var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	dateable = require('dateable'),
	config = require('../config.json'),
	mongojs = require('mongojs');


// TODO seperate db connections 
var collections = ["dataHour", "dataDaily", "dataMonthly", "Buildings"];

var db = mongojs("dashboard", collections);

var getBuildingsList = function getBuildingsList(callback) { 
	var buildings = new Array();
	db.Buildings.find({available: "Active"}, function(err, data) {
		if (data) {
			callback(data);
		}
	});	
}
exports.buildingsList = getBuildingsList;

// Building objects
var Building = function(date, time, code, status, consumption){
	this.date = date;
	this.time = time;
	this.code = code;
	this.status = status;
	this.value = consumption;
}

var BuildingMonths = function(month, year, code, status, consumption){
	this.month = month;
	this.year = year
	this.code = code;
	this.status = status;
	this.value = consumption;
}

var calcDate = function(year, month) {
	var dd = new Date(year, month, 0);
	return dd.getDate();
}

var daysInMonth = function(iMonth, iYear)
{
	return 32 - new Date(iYear, iMonth-1, 32).getDate();
}

// Sleep function
var sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


var parse = require('./parser.js');
var calc = require('./calculate.js');
var fileExistSync = require('./existsSync.js');
var path = require('path');

var onErr = function(err,callback){
	 db.close();
	 callback(err);
};

var storeDaily = function(flag, data) {
	if (flag == true) {
		calc.calcDaily(data, function(objects) {
			// console.log(objects)
			db.dataDaily.reIndex()
			for (var i = 0; i < objects.length; i++) {
				db.dataDaily.save(objects[i], function(err, res) {
					console.log('storing Daily Data')
					// ignoring duplicate key's error (Mongo:11000)
					if (err || !res){
						if (err.code === 11000){
							// onErr(err, callback); 
							// console.log("Error Inserting data: ", err)	
						}
					}
				});
			};
			
		});
		console.log("Stored in to dataDaily")
	}
	endOfDay = false;
}

var storeBuildings = function(BuildingsData) {
	db.Buildings.findOne({}, function(err, data) {
		if (data == null) {
			db.Buildings.insert(BuildingsData, function(err, results) {
				if(err) { console.log("Error: ", err) }
				console.log("Saved Buildings List");
			});
		} else {
			console.log("'Buildings' collection found --- popular");
		}
	});
}
var selectFilesAuto = function() {

	var today = new Date(),
	day = today.getDate(),
	month = today.getMonth() + 1,
	year = today.getFullYear();
	var todayDate = dateable.format(today, 'MMDDYYYY'); // Today's date formated.
	var todayDate_db = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated db.

	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var	dayY = yesterday.getDate(),
		monthY = yesterday.getMonth() + 1,
		yearY = yesterday.getFullYear();
	var yesterdayDate = dateable.format(yesterday, 'MMDDYYYY'); // Yesterday's date formatted;
	var yesterdayFile = yesterdayDate + "D.csv";
	var todayFile = todayDate + "D.csv";

	var files = {};
	// Directory containing the JC generated files
	var dir = config.MEU_data;
	var numOfFiles = fs.readdirSync(dir).length;
	if (numOfFiles < 2) {
		console.log("Not enough files in Directory: ", dir);
		setTimeout(function(){
			db.close();
		}, 1000);
		return;
	}
	
	incompleteFileToday = todayDate + "D_INCOMPLETE.csv";
	incompleteFileYesterday = yesterdayDate + "D_INCOMPLETE.csv";
	var exist = fileExistSync(path.resolve(dir, incompleteFileToday));

	if (exist) {
		console.log("Found Incomplete File: " + incompleteFileToday);
		var dataI = fs.readFileSync(path.resolve(dir, incompleteFileToday), 'utf-8');
		var hrI = parse.getFirstHour(dataI);
		var dataC = fs.readFileSync(path.resolve(dir, todayFile), 'utf-8');
		var hrC = parse.getFirstHour(dataC);
		if (parseInt(hrC) >= parseInt(hrI)) {
			if(!fileExistSync(path.resolve(dir, todayFile))) {
				console.log("File not Found");
				setTimeout(function(){
					db.close();
				}, 1000);
				return;
			}
			fileNew = todayFile;
			console.log("Reading from Main File");
		} else if (parseInt(hrC) < parseInt(hrI))  {
			fileNew = incompleteFileToday;
			console.log("Reading from Incomplete File!");
		}
	} else {
		console.log("No Incomplete files found for: " + todayDate);
		if(!fileExistSync(path.resolve(dir, todayFile))) {
			console.log("File not Found");
			setTimeout(function(){
				db.close();
			}, 1000);
			return;
		}
		fileNew = todayFile;
		console.log("Reading from Main File");
	}
	exist = fileExistSync(path.resolve(dir, incompleteFileYesterday));
	if (exist) {
		console.log("Found Incomplete File: " + incompleteFileYesterday);
		var dataI = fs.readFileSync(path.resolve(dir, incompleteFileYesterday), 'utf-8');
		var hrI = parse.getFirstHour(dataI);
		var dataC = fs.readFileSync(path.resolve(dir, yesterdayFile), 'utf-8');
		var hrC = parse.getFirstHour(dataC);
		if (parseInt(hrC) >= parseInt(hrI)) {
			if(!fileExistSync(path.resolve(dir, yesterdayFile))) {
				console.log("File not Found");
				setTimeout(function(){
					db.close();
				}, 1000);
				return;
			}
			fileOld = yesterdayFile;
			console.log("Reading from Main File");
		} else if (parseInt(hrC) < parseInt(hrI))  {
			fileOld = incompleteFileYesterday;
			console.log("Reading from Incomplete File!");
		}
		console.log("Reading from Incomplete File!");
	} else {
		console.log("No Incomplete files found for: " + yesterdayDate);
		if(!fileExistSync(path.resolve(dir, yesterdayFile))) {
			console.log("File not Found");
			setTimeout(function(){
				db.close();
			}, 1000);
			return;
		}
		fileOld = yesterdayFile;
		console.log("Reading from Main File");
	}
	files.dir = dir;
	files.fileNew = fileNew;
	files.fileOld = fileOld;
	files.numOfFiles = numOfFiles;
	return files;
}
exports.Building = Building;
exports.BuildingMonths = BuildingMonths;
exports.calcDate = calcDate;
exports.daysInMonth = daysInMonth;
exports.sleep = sleep;
exports.storeDaily = storeDaily;
exports.storeBuildings = storeBuildings;
exports.selectFilesAuto = selectFilesAuto;
exports.db = db;
exports.parse = parse;
exports.calc = calc;
exports.fileExistSync = fileExistSync;
exports.path = path;