var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	dateable = require('dateable'),
	config = require('../config.json');

var storeDataUtils = require('./storeDataUtils.js');
var collections = ["dataHour", "dataDaily", "dataMonthly", "Buildings"];
var db = mongojs("dashboard", collections);
var parse = require('./parser.js');
var calc = require('./calculate.js');
var fileExistSync = require('./existsSync.js');
var path = require('path');

var getBuildingsList = function getBuildingsList(callback) { 
	var buildings = new Array();
	db.Buildings.find({available: "Active"}, function(err, data) {
		if (data) {
			callback(data);
		}
	});	
}

db.on('error',function(err) {
    console.log('database error', err);
});

function saveData(asRoutine){
	// process.chdir('/home/sico/data');
	var cd = process.cwd();
	// Save Buildings List 
	var BuildingsFile = fs.readFileSync(require('path').resolve(__dirname , 'buildingsList.csv'), 'utf-8');
	var BuildingsData = parse.parseBuildingsData(BuildingsFile);
	// console.log(BuildingsData[0].code);
	storeDataUtils.storeBuildings(BuildingsData);
	var ff = new Date(2014, 8, 10);
	// db.dataDaily.remove({date:ff, code:"ELL"}, function(err, da) {
	// 	console.log(err, da);
	// })

	if (process.argv.length > 2) {
		var dir = process.argv[2];
		var numOfFiles = fs.readdirSync(dir).length;
		if (numOfFiles < 2) {
			console.log("Not enough files in Directory: ", dir);
			setTimeout(function(){
				db.close();
			}, 1000);
			return;
		}
		
		var fileNew = process.argv[3];
		var fileOld = process.argv[4];
		console.log("Reading from user defined files");


	} else {
		var files = storeDataUtils.selectFilesAuto();
		console.log(files)
		var dir = files.dir;
		var fileNew = files.fileNew;
		var fileOld = files.fileOld;
		var numOfFiles = files.numOfFiles;
		console.log("Reading from automatically defined files");
	}
	if(numOfFiles >= 2){
		var dataOld = fs.readFileSync(path.resolve(dir, fileOld), 'utf-8');
		var listOld = parse.parser(dataOld);
		var oldDt = calc.getOld(listOld);
	} else {
		console.log("Error ... Not enough files");
	}
	console.log("Number of files in: " + dir + " is " + numOfFiles);
	var dataNew = fs.readFileSync(path.resolve(dir, fileNew), 'utf-8');
	var listNew = parse.parser(dataNew);
	var dataHourly = calc.calcHourly(listNew, oldDt);

	db.dataHour.ensureIndex({"time":-1 , "code":-1 , "date": -1} , {unique : true , dropDups : true, sparse:true});
	db.dataDaily.ensureIndex({"time":-1, "code":-1, "date": -1} , {unique : true , dropDups : true, sparse:true});
	db.Buildings.ensureIndex({"code":-1} , {unique : true , dropDups : true, sparse:true});
	db.dataMonthly.ensureIndex({"month":-1, "code":-1, "year": -1} , {unique : true , dropDups : true, sparse:true});

	
	// console.log(BuildingsData);

	var monthArr = new Array();
	var fileDay = String(fileNew).slice(2,4);
	var fileMonth = String(fileNew).slice(0,2);
	var fileYear = String(fileNew).slice(4,8);
	var end = storeDataUtils.daysInMonth(fileMonth, fileYear);
	var timeH = null;
	var timeM = null;
	var endOfDay = false;
	// console.log(fileDay, fileMonth, fileYear, end);
	for (var i = 1; i <= end; i++) {
		var d = new Date(parseInt(fileYear), parseInt(fileMonth, 10) - 1, i);
		d.setFullYear(fileYear);
		monthArr[i-1] = dateable.format(d, 'MM/DD/YYYY');
	};
	
	// save hourly TODO: move to utils
	for (var i = 0; i < dataHourly.length; i++) {
		
		// save daily
		if (dataHourly[i].time) {
			timeH = parseInt(String(dataHourly[i].time).slice(0,2));
			timeM = parseInt(String(dataHourly[i].time).slice(3,5));
			// console.log(timeM);
		}
		
		if(timeH === 23) {
			endOfDay = true; 
		}

		var data = new storeDataUtils.Building(dataHourly[i].date, dataHourly[i].time, 
			dataHourly[i].code, dataHourly[i].status, dataHourly[i].value);

		db.dataHour.findAndModify({
			query: data,
			update: {
				$setOnInsert: data
			},
			new: true,
			upsert:true
		}, function(err, results) {
			// ignoring duplicate key's error (Mongo:11000)
			// console.log(err)
			if (err || !results) {
				if (err.code !== 11000){
					// onErr(err);
					console.log("Error Inserting data: ", err)
				} 
			}
		});
					
	}
	// save daily
	storeDataUtils.storeDaily(endOfDay, dataHourly);
	console.log(parseInt(fileDay, 10), end);
	// save Monthly
	if (parseInt(fileDay, 10) === end && timeH === 23) {
		getBuildingsList(function(buildings) {
			console.log(fileMonth, fileYear, buildings.length);
			for (var i = 0; i < buildings.length; i++) {
				calc.findMonthly(fileMonth, fileYear, monthArr, buildings[i].code, end, function(result){
					db.dataMonthly.insert(result, function(err, results) {
						// console.log("dataMonthly ", err, results);
						if (err || !results) {
							if (err.code !== 11000){
								onErr(err, callback);
								console.log("Error Inserting data: ", err) 	
							}
						}
					});
				});
			}
		});
	}
	// Leaving time for all callbacks to finish
	setTimeout(function(){
		db.close();
	}, 10000);
	return "Done";
	callback();
}
saveData()
// module.exports = {
// 	saveData: saveData()
// }


