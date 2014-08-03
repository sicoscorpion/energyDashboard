/* 
	Parse data from .csv files and prepare for calculations 
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
function BuildingProfile(name, code, profile, size, built, renovated, feature){
	this.name = name;
	this.code = code;
	this.profile = profile;
	this.size = size;
	this.built = built;
	this.renovated = renovated;
	this.feature = feature;
}

module.exports = {
	parser : function(data){
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
	},
	getFirstHour: function(data) {
		data = data.split("\n");
		for(var i = 1; i > 0; i--){
			if(data[i] === "" || data[i] === '\r') { 					
				continue; 
			}
			var fields = String(data[i]).split(',');
			var fieldNum = 0;
			field = fields[0].replace(/"/g, "");
			date = field.slice(0,10);
			time = field.slice(11, 13);
			return time;
		}				
	},
	parseBuildingsData: function(data) {
		var BuildingsList = new Array();

		data = data.split("\n");
		for(var i = 1, x = 0; i < data.length; i++, x++){
			if(data[i] === "" || data[i] === '\r') { 					
				continue; 
			}
			var fields = String(data[i]).split(',');
			var fieldNum = 0;
			BuildingsList[x] = new BuildingProfile();
			var name = new Array(),
				code = new Array(),
				profile = new Array(),
				size = new Array(),
				built = new Array(),
				renovated = new Array(),
				feature = new Array();
				type = new Array();
				available = new Array();
				image = new Array();
			fields.forEach(function (field){
				field = field.replace(/"/g, "");
				// console.log(field + " xx ");
				switch (fieldNum)
				{					
					case 0:
						BuildingsList[x].name = field;
						break;
					case 1:
						BuildingsList[x].code = field;
						break;
					case 2:
						BuildingsList[x].profile = field;
						break;
					case 3:
						BuildingsList[x].size = field;
						break;
					case 4:
						BuildingsList[x].built = field;
						break;
					case 5:
						BuildingsList[x].renovated = field;
						break;
					case 6:
						BuildingsList[x].feature = field;
						break;
					case 7:
						BuildingsList[x].type = field;
						break;
					case 8:
						BuildingsList[x].available = field;
						break;
					case 9:
						BuildingsList[x].image = field;
						break;
				}
				fieldNum++;
			});
		}
		// console.log(BuildingsList);
		return BuildingsList;
	}
}
