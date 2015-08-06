var config = require('../config.json');

var collections = ["Buildings"];

var db = require('mongojs').connect('test', collections);

module.exports = {
  getBuildingsList: function (callback) { 
    db.Buildings.find({available: "Active"}, function(err, data) {
      if (data) {
        callback(data);
        db.close();
      }
    }); 
  }

}