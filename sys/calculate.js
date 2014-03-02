/* 
	calculate electricity consumption to be stored in db-Dashboard {dataHour, dataDaily, dataMonthly} 
	TODO usage
*/
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

var BuildingsCodes = ["SEM", "SM2", "CRO", "EAT", "CHI", "UNH", "RHO", "SUB", "BAC", "WHI", "MAN",
"CUT", "RRG", "HOR", "VML", "VM2", "DEN", "WMH", "WIL", "CAR", "HSH", "EMM", "ELL"];

var store = require('./storeData.js');
var db = store.db;

module.exports = {
	getOld: function(oldData){
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
		return oldObjects;	
	},


	// Primary calculations 
	calcHourly: function(data, old) {
		var objects = new Array();

		for (var i = 0, x = 0; i < data.length; i++, x++) {
			objects[x] = new Building();
			if (data[i].time === "00:00:00") {
				if (!old) { 
					objects[x].value = 0;
				} else {
					for (var m = 0; m < old.length; m++) {
						if(data[i].code === old[m].code){
							objects[x].value = (data[i].value - old[m].value) / 2;
						}
					}
				}
				
			} else {
				for (var j = i - 1; j >= 0; j--) {
					if (data[i].code === data[j].code){
						if (data[i].value < data[j].value) {
							objects[x].value = data[i].value;
							break;
						} else {
							objects[x].value = data[i].value - data[j].value;
							break;
						}
					}
				}
			}

		
			objects[x].time = data[i].time;
			objects[x].date = new Date(data[i].date);
			objects[x].code = data[i].code;
			objects[x].status = data[i].status;

		}

		
		return objects;	
	},

	// Daily calculations 
	calcDaily: function(data) {
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
			}
			objects[i].date = new Date(x);
			objects[i].time = "23:00:00";
			objects[i].code = BuildingsCodes[i];
			objects[i].status = "relaible";
			objects[i].value = accumValues[i];
			counter = 0;
		}
		return objects;
	},

	findMonthly: function(month, year, monthArr, Buil, monthLength, callback) {
		db.dataDaily.find({code: Buil}, function(err, data) {
			var object = new BuildingMonths();
			if (data !== undefined) {
				
				object.code = Buil;
				var accum = 0;
				for (var i = 0; i < data.length; i++)
				{
					if (String(data[i].date).slice(0,2) === month) {
						accum += data[i].value;
					}
				}
				object.month = month;
				object.year = year;
				
				object.status = "relaible";
				object.value = accum;
			} 
			callback(object, err);
		});
	}

}