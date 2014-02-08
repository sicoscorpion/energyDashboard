var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	dateable = require('dateable');


var collections = ["dataHour", "dataDaily", "dataMonthly"];

var db = require('mongojs').connect('test', collections);
Tail = require('tail').Tail;
var async = require('async');


// var db = new Db('test', new Server("127.0.0.1", 27017,
//   {auto_reconnect: true, poolSize: 4}), {safe:false, native_parser: false});

var BuildingsCodes = ["SEM", "SM2", "CRO", "EAT", "CHI", "UNH", "RHO", "SUB", "BAC", "WHI", "MAN",
"CUT", "RRG", "HOR", "VML", "VM2", "DEN", "WMH", "WIL", "CAR", "HSH", "EMM", "ELL"];

// Building object
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
// console.log(todayFile);
// console.log(day);

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


// Raw data parsing
function parser(data){
	var Buildings = new Array();
	// Lines
	data = data.split("\n");
	for(var i = data.length, x = 0; i >= 0; i--, x++){
		if(data[i] === "" || data[i] === '\r') { 					
			x--;
			continue; 
		}

		// fields
		var fields = String(data[i]).split(',');
		var fieldNum = 0;
		Buildings[x] = new Building();
		var date = new Array(),
			time = new Array(),
			code = new Array(),
			status = new Array(),
			consumption = new Array();

		fields.forEach(function (field){
			field = field.replace(/"/g, "");
			// console.log(field + " xx ");
			switch (fieldNum)
			{					
				case 0:
					date = field.slice(0,10);
					time = field.slice(11);
					// if(time.slice(3,5))
					Buildings[x].date = date;
					Buildings[x].time = time;
					break;
					
				case 1:
					code = field.slice(8,11);
					if (code === "SEM"){
						if (field.slice(50,54) === "MTR2")
							Buildings[x].code = "SM2";
						else
							Buildings[x].code = code;
						// console.log(field.slice(50,54));
					} 
					else if (code === "VML"){
						if (field.slice(50,54) === "MTR2")
							Buildings[x].code = "VM2";
							// console.log(field.slice(50,54));
						else
							Buildings[x].code = code;
					} else if (code === "BAC"){
						if (field.slice(50,54) !== "MTR.")
							Buildings[x].code = "BA2";
							// console.log(field.slice(50,54));
						else
							Buildings[x].code = code;
					}
					else
						Buildings[x].code = code;
					break;
				case 3:
					status = field.slice(0,10);
					Buildings[x].status = status;
					break;
				case 4:
					consumption = parseFloat(field);
					Buildings[x].value = consumption;
					break;
			}
			fieldNum++;
		});
	}
	return Buildings;
}



function getOld(oldData){
	var oldObjects = new Array();
	for (var i = 0, x = 0; i < oldData.length; i++, x++) {		

		if (oldData[i].time === "23:00:00"){
			oldObjects[x] = new Building();
			oldObjects[x].time = oldData[i].time;
			oldObjects[x].date = oldData[i].date;
			oldObjects[x].code = oldData[i].code;
			oldObjects[x].status = oldData[i].status;
			oldObjects[x].value = oldData[i].value;
		} else {
			x--;
		} 		
	}	
	// console.log(oldObjects);
	return oldObjects;	
}


// Primary calculations 
function calcHourly(data, old) {
	var objects = new Array();

	for (var i = 0, x = 0; i < data.length; i++, x++) {
		objects[x] = new Building();
		
		if (data[i].time === "00:00:00") {
			// console.log("I am Here @ old");
			if (!old) { 
				objects[x].value = 0;
			} else {
				for (var m = 0; m < old.length; m++) {
					// console.log("I am Here @ old" + m);
					if(data[i].code === old[m].code){
						// console.log("I am Here @ old" + data[i].code);
						objects[x].value = (data[i].value - old[m].value) / 2;
					}
				}
			}
			
		} else {
			for (var j = i - 1; j >= 0; j--) {
				if (data[i].code === data[j].code){
					if (data[i].value < data[j].value) {
						objects[x].value = data[i].value;
						// console.log("Reset value detected ... " + data[i].date);
						break;
					} else {
						objects[x].value = data[i].value - data[j].value;
						break;
					}
				}
			}
		}

	
		objects[x].time = data[i].time;
		objects[x].date = data[i].date;
		objects[x].code = data[i].code;
		objects[x].status = data[i].status;

	}

	
	return objects;	
}

// Daily calculations 
function calcDaily(data) {
	var counter = 0,
		accumValues = new Array(),
		objects = new Array();
	for (var i = 0; i < BuildingsCodes.length; i++){
		accumValues[i] = 0;
		objects[i] = new Building();
		var x = "";
		for (var j = 0; j < data.length - 1; j++) {
			x = data[j].date;
			if (data[j].code === BuildingsCodes[i]) {
				if (data[j].value != null) {
					counter++;
					accumValues[i] = accumValues[i] + data[j].value;
				}
			}
			// console.log(data[j].date);
		}
		objects[i].date = x;
		objects[i].time = "23:00:00";
		objects[i].code = BuildingsCodes[i];
		objects[i].status = "reliable";
		objects[i].value = accumValues[i];

		// console.log(objects[i]);
		counter = 0;
	}
	return objects;
}

function findMonthly(month, year, monthArr, Buil, monthLength, callback) {
	db.dataDaily.find({code: Buil}, function(err, data) {
		// if (data === undefined)
			// console.log(data);
		var object = new BuildingMonths();
		if (data !== undefined) {
			
			object.code = Buil;
			var accum = 0;
			for (var i = 0; i < data.length; i++)
			{
				if (String(data[i].date).slice(0,2) === month && String(data[i].date).slice(6,10) === year) {
					accum += data[i].value;
					// console.log(accum);
				}
				// console.log("YES!", String(data[i].date).slice(6,10), year);
			}
			object.month = month;
			object.year = year;
			
			object.status = "reliable";
			object.value = accum;
			// console.log(object);
			
		} 
		callback(object, err);
		// if (String(data.date).slice(0,2) === month) {	
		// 	var object = new BuildingMonths();
		// 	
		// 	for (var i = 0; i <	monthLength; i++) {
		// 		for (var j = 0; j < data.length; j++) {
		// 			if (monthArr[i] === data[j].date) {
		// 				accum += data[j].value;
		// 				console.log(data[j]);
		// 			}
						
		// 		}
		// 	};
			
		// }
	});
}

var onErr = function(err,callback){
 db.close();
 callback(err);
};
var fileExistSync = require('./existsSync.js');


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
			fileNew = incompleteFileToday;
			console.log("Reading from Incomplete File!");
		} else {
			console.log("No Incomplete files found for: " + todayDate);
			fileNew = todayFile;
			console.log("Reading from Main File");
		}
		exist = fileExistSync('/home/cslab/DATA/' + incompleteFileYesterday);
		if (exist) {
			console.log("Found Incomplete File: " + incompleteFileYesterday);
			fileOld = incompleteFileYesterday;
			console.log("Reading from Incomplete File!");
		} else {
			console.log("No Incomplete files found for: " + yesterdayDate);
			fileOld = yesterdayFile;
			console.log("Reading from Main File");
		}
		
		// console.log('Current directory: ' + process.cwd());
	}
	if(numOfFiles >= 2){
		var dataOld = fs.readFileSync('/home/cslab/DATA/' + fileOld, 'utf-8');
		var listOld = parser(dataOld);
		var oldDt = getOld(listOld);
	} else {
		console.log("Error ... Not enough files");
	}
	console.log(dir, numOfFiles);
	var dataNew = fs.readFileSync('/home/cslab/DATA/' + fileNew, 'utf-8');
	var listNew = parser(dataNew);
	var dataHourly = calcHourly(listNew, oldDt);

	db.dataHour.ensureIndex({"time":-1 , "code":-1 , "date": -1} , {unique : true , dropDups : true});
	db.dataDaily.ensureIndex({"time":-1, "code":-1, "date": -1} , {unique : true , dropDups : true});
	db.dataMonthly.ensureIndex({"month":-1, "_id":-1, "year": -1} , {unique : true , dropDups : true});
	var monthArr = new Array();
	var fileDay = String(fileNew).slice(2,4);
	var fileMonth = String(fileNew).slice(0,2);
	var fileYear = String(fileNew).slice(4,8);
	var end = daysInMonth(fileMonth, fileYear);
	var timeH = null;
	console.log(fileDay, fileMonth, fileYear, end);
	for (var i = 1; i <= end; i++) {
		var d = new Date(parseInt(fileYear), parseInt(fileMonth, 10) - 1, i);
		d.setFullYear(fileYear);
		monthArr[i-1] = dateable.format(d, 'MM/DD/YYYY');
		console.log(monthArr[i-1]);
	};
	
	for (var i = 0; i < dataHourly.length; i++) {
		if(dataHourly[i].code === "UNH"){
			// console.log("DataHourly ==> Building: " + dataHourly[i].code + " @ " + dataHourly[i].time + 
				// " Used: " + dataHourly[i].value);
		}

			// save daily
		if (dataHourly[i].time) {
			timeH = parseInt(String(dataHourly[i].time).slice(0,2));
			// console.log(timeH, dataHourly[i].time);
		}
		
		if(timeH === 23){
			// console.log("00000")
			var dt = calcDaily(dataHourly);
			db.dataDaily.save(dt, function(err, results) {
				// console.log("dataDaily Waiting .... ")
				if (err || !results){
					if (err) onErr(err, callback);
					console.log("err: error saving data in dataDaily" + err);
				}
			});
		};
		// console.log(typeof(fileDay), typeof(end));
		

			// save hourly
		var data = new Building(dataHourly[i].date, dataHourly[i].time, 
			dataHourly[i].code, dataHourly[i].status, dataHourly[i].value);

		db.dataHour.save(data, function(err, results) {
			if (err || !results) {
				if (err) onErr(err, callback); 
				console.log("Data @: " + data.time + " Not saved because of error " + err);
			}
			// console.log("dataHourly Waiting ...");
			// db.close();
		});
					
	}
	console.log(fileDay, timeH);
	if (parseInt(fileDay, 10) === end && timeH === 23) {
		// var m = todayDate_db.slice(0,2);
		// var y = todayDate_db.slice(6,10);
		console.log("Saving Month ... ", fileMonth, fileYear);
		console.log(fileMonth, fileYear, BuildingsCodes.length);
		for (var i = 0; i < BuildingsCodes.length; i++) {
			// console.log(BuildingsCodes[i]);
			findMonthly(fileMonth, fileYear, monthArr, BuildingsCodes[i], end, function(result){
				db.dataMonthly.save(result, function(err, results) {
					if (err || !results) {
						if (err) onErr(err, callback);
						console.log("err: error saving data in dataDaily" + err);
					}
					console.log("saved ", results);
				});
				// console.log(result);
			});
			db.dataMonthly.find({year:"2014"}, function(err, res) {
				console.log(res, err);
			})
		}
	}
	// if (day === end && da.getHours() === 23) {
	// 	var m = todayDate_db.slice(0,2);
	// 	var y = todayDate_db.slice(6,10);
	// 	for (var i = 0; i < BuildingsCodes.length; i++) {
	// 		findMonthly("01", y, monthArr, BuildingsCodes[i], end, function(result){
	// 			db.dataMonthly.save(result, function(err, results) {
	// 				if (err || !results) {
	// 					if (err) onErr(err, callback);
	// 					console.log("err: error saving data in dataDaily" + err);
	// 				}
	// 			});
	// 			// console.log(result.length);
	// 		});
	// 	};
	// 	// console.log(m);
	// }


	console.log("SAVING ... ");

	setTimeout(function(){
		db.close();
	}, 10000);
	return "Done";
	callback();
}

saveData();




