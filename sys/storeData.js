/* 
	Handle the Parsed & calculated data and set conditions for when they should be stored
   	TODO usage
*/

var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	dateable = require('dateable');


// TODO seperate db connections 
var collections = ["dataHour", "dataDaily", "dataMonthly"];

var db = require('mongojs').connect('dashboard', collections);
exports.db = db;

var BuildingsCodes = ["SEM", "SM2", "CRO", "EAT", "CHI", "UNH", "RHO", "SUB", "BAC", "WHI", "MAN",
"CUT", "RRG", "HOR", "VML", "VM2", "DEN", "WMH", "WIL", "CAR", "HSH", "EMM", "ELL"];

// Building objects
function Building(date, time, code, status, consumption){
	this.date = date;
	this.time = time;
	this.code = code;
	this.status = status;
	this.value = consumption;
}

function BuildingMonths(month, year, code, status, consumption){
	this.month = month;
	this.year = year
	this.code = code;
	this.status = status;
	this.value = consumption;
}

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

function calcDate(year, month) {
	var dd = new Date(year, month, 0);
	return dd.getDate();
}

function daysInMonth(iMonth, iYear)
{
	return 32 - new Date(iYear, iMonth-1, 32).getDate();
}

// Sleep function
function sleep(milliseconds) {
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

var onErr = function(err,callback){
	 db.close();
	 callback(err);
};

function saveData(callback){
	// process.chdir('/home/sico/data');
	if (process.argv.length > 2) {
		var dir = process.argv[2];
		var numOfFiles = fs.readdirSync(dir).length;
		var fileNew = process.argv[3];
		var fileOld = process.argv[4];
		console.log("Reading from user defined files");
		// console.log('Current directory: ' + process.cwd());

	} else {
		var dir = '/home/cslab/DATA/';
		var numOfFiles = fs.readdirSync(dir).length;
		
		console.log("Reading from automatically defined files");
		incompleteFileToday = todayDate + "D_INCOMPLETE.csv";
		incompleteFileYesterday = yesterdayDate + "D_INCOMPLETE.csv";
		var exist = fileExistSync('/home/cslab/DATA/' + incompleteFileToday);
		if (exist) {
			console.log("Found Incomplete File: " + incompleteFileToday);
			var dataI = fs.readFileSync('/home/cslab/DATA/' + incompleteFileToday, 'utf-8');
			var hrI = parse.getFirstHour(dataI);
			var dataC = fs.readFileSync('/home/cslab/DATA/' + todayFile, 'utf-8');
			var hrC = parse.getFirstHour(dataC);
			if (parseInt(hrC) >= parseInt(hrI)) {
				fileNew = todayFile;
				console.log("Reading from Main File");
			} else if (parseInt(hrC) < parseInt(hrI))  {
				fileNew = incompleteFileToday;
				console.log("Reading from Incomplete File!");
			}
		} else {
			console.log("No Incomplete files found for: " + todayDate);
			fileNew = todayFile;
			console.log("Reading from Main File");
		}
		exist = fileExistSync('/home/cslab/DATA/' + incompleteFileYesterday);
		if (exist) {
			console.log("Found Incomplete File: " + incompleteFileYesterday);
			var dataI = fs.readFileSync('/home/cslab/DATA/' + incompleteFileYesterday, 'utf-8');
			var hrI = parse.getFirstHour(dataI);
			var dataC = fs.readFileSync('/home/cslab/DATA/' + yesterdayFile, 'utf-8');
			var hrC = parse.getFirstHour(dataC);
			if (parseInt(hrC) >= parseInt(hrI)) {
				fileOld = yesterdayFile;
				console.log("Reading from Main File");
			} else if (parseInt(hrC) < parseInt(hrI))  {
				fileOld = incompleteFileYesterday;
				console.log("Reading from Incomplete File!");
			}
			console.log("Reading from Incomplete File!");
		} else {
			console.log("No Incomplete files found for: " + yesterdayDate);
			fileOld = yesterdayFile;
			console.log("Reading from Main File");
		}
	}
	if(numOfFiles >= 2){
		var dataOld = fs.readFileSync('/home/cslab/DATA/' + fileOld, 'utf-8');
		var listOld = parse.parser(dataOld);
		var oldDt = calc.getOld(listOld);
	} else {
		console.log("Error ... Not enough files");
	}
	console.log("Number of files in: " + dir + " is " + numOfFiles);
	var dataNew = fs.readFileSync('/home/cslab/DATA/' + fileNew, 'utf-8');
	var listNew = parse.parser(dataNew);
	var dataHourly = calc.calcHourly(listNew, oldDt);

	db.dataHour.ensureIndex({"time":-1 , "code":-1 , "date": -1} , {unique : true , dropDups : true});
	db.dataDaily.ensureIndex({"time":-1, "code":-1, "date": -1} , {unique : true , dropDups : true});
	db.dataMonthly.ensureIndex({"month":-1, "code":-1, "year": -1} , {unique : true , dropDups : true});
	var monthArr = new Array();
	var fileDay = String(fileNew).slice(2,4);
	var fileMonth = String(fileNew).slice(0,2);
	var fileYear = String(fileNew).slice(4,8);
	var end = daysInMonth(fileMonth, fileYear);
	var timeH = null;
	// console.log(fileDay, fileMonth, fileYear, end);
	for (var i = 1; i <= end; i++) {
		var d = new Date(parseInt(fileYear), parseInt(fileMonth, 10) - 1, i);
		d.setFullYear(fileYear);
		monthArr[i-1] = dateable.format(d, 'MM/DD/YYYY');
	};
	
	for (var i = 0; i < dataHourly.length; i++) {
		
		// save daily
		if (dataHourly[i].time) {
			timeH = parseInt(String(dataHourly[i].time).slice(0,2));
		}
		
		if(timeH === 23){
			var dt = calc.calcDaily(dataHourly);
			db.dataDaily.insert(dt, function(err, results) {
				// ignoring duplicate key's error (Mongo:11000)
				// console.log("dataDaily ", err, results)
				if (err || !results){
					if (err.code !== 11000){
						onErr(err, callback); 
						console.log("Error Inserting data: ", err)	
					}
				}
			});
		};
		// save hourly
		var data = new Building(dataHourly[i].date, dataHourly[i].time, 
			dataHourly[i].code, dataHourly[i].status, dataHourly[i].value);
		db.dataHour.insert(data, function(err, results) {
			// ignoring duplicate key's error (Mongo:11000)
			// console.log("dataHour ", err, results)
			if (err || !results) {
				if (err.code !== 11000){
					onErr(err, callback);
					console.log("Error Inserting data: ", err)
				} 
			}
		});
					
	}
	// console.log(parseInt(fileDay, 10), end);
	// save Monthly
	if (parseInt(fileDay, 10) === end && timeH === 23) {

		// console.log(fileMonth, fileYear, BuildingsCodes.length);
		for (var i = 0; i < BuildingsCodes.length; i++) {
			calc.findMonthly(fileMonth, fileYear, monthArr, BuildingsCodes[i], end, function(result){
				db.dataMonthly.insert(result, function(err, results) {
					if (err || !results) {
						if (err.code !== 11000){
							onErr(err, callback);
							console.log("Error Inserting data: ", err) 	
						}
					}
				});
			});
		}
	}
	// Leaving time for all callbacks to finish
	setTimeout(function(){
		db.close();
	}, 10000);
	return "Done";
	callback();
}
// To give the option to run the routine manually this function is called. UGLY : 
saveData();



