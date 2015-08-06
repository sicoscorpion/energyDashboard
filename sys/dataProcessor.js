
var dataModels = require('./dataModels.js');

module.exports = {
  parseRawFile : function(data){
    var result = new Array();
    // Lines
    data = data.split("\n");
    for(var i = data.length-1, x = 0; i >= 1; i--, x++){
      if(data[i] === "" || data[i] === '\r') {          
        x--;
        continue; 
      }

      // fields
      var fields = String(data[i]).split(',');
      var fieldNum = 0;
      result[x] = new dataModels.accumHourly();
      var dateTime = new Array(),
        location = new Array(),
        status = new Array(),
        consumption = new Array();

      fields.forEach(function (field){
        field = field.replace(/"/g, "");
        switch (fieldNum)
        {         
          case 0:
            rawDateTime = field.slice(0,10);
            rawTime = field.slice(11);
            result[x].dateTime = new Date(field);
            break;
            
          case 1:
            location = field.slice(8,11);
            if (location === "SEM"){
              if (field.slice(50,54) === "MTR2")
                result[x].location = "SM2";
              else
                result[x].location = location;
            } 
            else if (location === "VML"){
              if (field.slice(50,54) === "MTR2")
                result[x].location = "VM2";
                // console.log(field.slice(50,54));
              else
                result[x].location = location;
            } else if (location === "BAC"){
              if (field.slice(50,54) !== "MTR.")
                result[x].location = "BA2";
                // console.log(field.slice(50,54));
              else
                result[x].location = location;
            }
            else
              result[x].location = location;
            break;
          case 4:
            consumption = parseFloat(field);
            result[x].value = consumption;
            break;
        }
        fieldNum++;
      });
    }
    return result;
  },
  calcHourly: function(data, old) {
    var objects = new Array();

    for (var i = 0, x = 0; i < data.length; i++, x++) {
      objects[x] = new dataModels.Hourly();

      if (data[i].dateTime.getHours() == 0) {
        if (!old) { 
          objects[x].value = 0;
        } else {
          for (var m = 0; m < old.length; m++) {
            if(data[i].location === old[m].location && old[m].dateTime.getHours() == 23 ){
              objects[x].value = (data[i].value - old[m].value) / 2;
              // console.log(data[i].value, old[m].value);
            }
          }
        }
        
      } else {
        for (var j = i - 1; j >= 0; j--) {
          if (data[i].location === data[j].location){
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

      objects[x].dateTime = data[i].dateTime;
      objects[x].location = data[i].location;
    }

    return objects; 
  },
  prepareHourly: function(data, buildings) {
    var objects = new Array();

    var i = 0;
    buildings.forEach(function (building) {

      startDate = new Date(data[0].dateTime);
      startDate.setHours(0,0,0,0);
      endDate = new Date(data[0].dateTime);
      endDate.setHours(23,00,00);

      // console.log(startDate, endDate)

      currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        objects[i] = new dataModels.Hourly();
        objects[i].dateTime = new Date(currentDate);
        objects[i].location = building.code;
        objects[i].value = 0;
        currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes()+30));
        // console.log(currentDate, i);
        i++;
      }
    })
    

    data.forEach(function (record) {
      for (var i = 0; i < objects.length; i++) {
        if (record.dateTime.getHours() == objects[i].dateTime.getHours() && record.location == objects[i].location) {
          if (record.dateTime.getMinutes() >= 0 && record.dateTime.getMinutes() <= 30) {
            objects[i].value += record.value;
          } else {
            i++;
            objects[i].value += record.value;
          }
        }
      };
    });

    return objects;
  }
}