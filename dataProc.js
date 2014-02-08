var fs = require('fs');
var execSync = require('exec-sync');
var exec = require('child_process').exec;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var sys = require('sys');
var db = new Db('test', new Server("127.0.0.1", 27017,
  {auto_reconnect: false, poolSize: 4}), {safe:false, native_parser: false});

// var insertData = function(err, collection) {
// 	collection.insert({name: "Kristiono Setyadi"});
// 	collection.insert({name: "Meghan Gill"});
// 	collection.insert({name: "Spiderman"});
// }

// var removeData = function(err, collection) {
// 	collection.remove();
// }

// var updateData = function(err, collection) {
// 	collection.update({name: "Kristiono Setyadi"}, {name: "Kristiono Setyadi", sex: "Male"});
// }

// var listAllData = function(err, collection) {
// 	collection.find().toArray(function(err, results) {
// 		console.log(results);
// 	});
// }

// var findName = function(err, collection) {
// 	console.log("Find Name...");
// 	collection.find({name: "Kristiono Setyadi"}).toArray(function(err, results) {
// 		console.log(results);
// 	});
// }

// db.open(function(err, pdb) {
// 	// db.collection('test_insert', insertData);

// 	db.collection('dataHour', removeData);

// 	// db.collection('test_insert', updateData);

// 	db.collection('dataHour', listAllData);

// 	// db.collection('test_insert', findName);
// 	// db.close();
// });
// var dataBase = null;
// db.close();
// db.open(function(err, db){

// });

var today = new Date(),
	day = today.getDate(),
	month = today.getMonth() + 1,
	year = today.getFullYear();
var todayDate = month + "" + day + "" + year; //date formated as file names.

function prevConsumption(code, consumption){
	this.code = code;
	this.value = consumption;
}
function Building(date_time, code, status, consumption){
	this.dateTime = date_time;
	this.code = code;
	this.status = status;
	this.value = consumption;
}


var	Buildings = new Array();
var	prev = new Array();

fs.readdir('sys/tmp-fetched', function(err, files){

	console.log(files.length);
	files.forEach(function(filename){
		if(files.length == 0){
			console.log("EMPTY DIRECTORY");
			return;
		}
		console.log(todayDate);
		

		// TODO 
		// if(filename.slice(0,9) != todayDate){
		// 	console.log("Not today's data .. ");
		// 	fs.unlink("sys/tmp-fetched/" + filename, function(err){
		// 		if(err) throw err;
				// console.log(filename + "has been deleted");
		// 		return;
		// 	});
		// }

		

		fs.readFile('sys/tmp-fetched/' + filename, 'utf-8', function(err, data){

			var lines = String(data).split('\n');
			var numOfLines = lines.length;
			var fields = new Array();
			// console.log("Line: " + JSON.stringify(lines[lines.length -1]));
			exec("sed '/^$/d' " + filename, function(error, stdout, stderr){
				// console.log('stdout: ' + stdout);
				// console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
			for (var i = lines.length - 1, x = 0; i > 0; i--, x++) {
				if(lines[i] === "\r" || lines[i] === "\n" ){ return; }
				// console.log("Line: " + lines[i]);
				prev[x] = new prevConsumption();
				Buildings[x] = new Building();
				fields = String(lines[i]).split(',');
				// console.log(fields[i]);
				// var counter = 0,
				var	fieldNum = 0;
				var date = new Array(),
					time = new Array(),
					code = new Array(),
					status = new Array(),
					consumption = new Array();
					

				fields.forEach(function(field){
					var str = field.replace(/["]/g, "");
					if(str === "\r" || str === "\n") return; 

					fieldNum++;
					switch (fieldNum)
					{					
						case 1:
							date = str.slice(0,10);
							time = str.slice(11);
							
							Buildings[x].dateTime = date + " " + time;
							// console.log(Buildings[i]);
							break;
						case 2:
							code = str.slice(8,11);
							Buildings[x].code = code;
							// if(time == "00:00:00") prevConsumption[i].code = code;
							// console.log("Building code: " + code);
							break;
						case 4:
							status = str.slice(0,10);
							Buildings[x].status = status;
							// console.log(status);
							break;
						case 5:
							consumption = parseInt(str);
							Buildings[x].value = consumption;
							// console.log("consumption: " + consumption);
							// if(time == "00:00:00") prevConsumption[i].value =  consumption; 
							// consumption = consumption - prevConsumption;
							// fieldNum = 0;
							// counter++;

							// console.log("Building: " + code + " used: " + consumption + " @ " + time + " " + date);
						break;
					}
				});
			};
			// for (var y = 0; y < Buildings.length; y++) {
			// 	for (var z = Buildings.length; z >= 0; z--) {
			// 		if(Buildings[y].code == Buildings[z].code){
			// 			Buildings[y].value -= Buildings[z].value;
			// 		}
			// 	}
			// }
			for (var i = 0; i < Buildings.length - 1580; i++) {
				console.log(Buildings[i]);
			};
			
		});
	});
});



