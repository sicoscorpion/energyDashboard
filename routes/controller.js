/* 
    checks out (and assign if nessasary) the db-Dashboard schemas, and handle all the routing 
    TODO usage
*/

var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var dateable = require('dateable');

var extras = require('../extras.js');

var list = ['dataHour', 'dataDaily', 'dataMonthly'];
var db_list = ['DH', 'DD', 'DM'];

for (var i = 0; i < db_list.length; i++) {
    if (db_list[i] === "DM") {
        Mongoose.model(db_list[i], new Schema({
            month           :  String, 
            code            :  String,
            status          :  String,
            value           :  Number
        }, {collection  : list[i]}   ));   
    } else {
        Mongoose.model(db_list[i], new Schema({
            date            :  Date,
            time            :  String, 
            code            :  String,
            status          :  String,
            value           :  Number
        }, {collection  : list[i]}   ));
    }
    // console.log("DB List got.. " + db_list[i]);
};

var dataHour = Mongoose.model('DH');
var dataDaily = Mongoose.model('DD');
var dataMonthly = Mongoose.model('DM');

module.exports = {
    getPerHour: function(req, res){
        var today = new Date();
        var todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
        var par1 = req.params.val;
        var val = par1.slice(0,2) + "/" + par1.slice(3,5) + "/" + par1.slice(6,10);
        var value = new Date(val);
        var par2 = req.params.build;
        dataHour.find({date: value, code: par2}, function(err, data){
            if (err) {
                console.log("ERR: ", __filename, "func: getPerHour");
                console.log("Error getting data from dataHour: ", err);
            }  else {
                res.json(data);
            }
        });
    },

    getPerDay: function(req, res){
        var today = new Date();
        var todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
        var sunday = extras.getSunday(today);
        var sundayDate = dateable.format(sunday, 'MM/DD/YYYY'); // Today's date formated.
        var par1 = req.params.from;
        var par2 = req.params.to;
        var begin = par1.slice(0,2) + "/" + par1.slice(3,5) + "/" + par1.slice(6,10);
        var end = par2.slice(0,2) + "/" + par2.slice(3,5) + "/" + par2.slice(6,10);
        var begin = new Date(begin);
        var end = new Date(end);
        dataDaily.find({date: {$gt:begin, $lt:end}, code: req.params.build}, function(err, data){
            if (err) {
                console.log("ERR: ", __filename, "func: getPerDay");
                console.log("Error getting data from dataDaily: ", err);
            }  else {
                res.json(data);
            }
        });
    },

    getForWeek: function(req, res){
        var today = new Date();
        var todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
        var sunday = extras.getSunday(today);
        var sundayDate = dateable.format(sunday, 'MM/DD/YYYY'); // Today's date formated.
        var par = req.params.build;
        dataDaily.find({date: {$gt:new Date(sundayDate), $lt:new Date(todayDate)}, code:par}, function(err, data){
            if (err) {
                console.log("ERR: ", __filename, "func: getForWeek");
                console.log("Error getting data from dataDaily: ", err);
            }  else {
                res.json(data);
            }
        });
    },

    getForMonth: function(req, res){
        var today = new Date();
        var todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
        var d = new Date(); // current date
        d.setDate(1); // going to 1st of the month
        d.setHours(-1);
        var par = req.params.build;
        var lastDate = dateable.format(d, 'MM/DD/YYYY');
        dataDaily.find({date: {$gt: new Date(lastDate)}, code:par}, function(err, data){
            if (err) {
                console.log("ERR: ", __filename, "func: getForMonth");
                console.log("Error getting data from dataDaily: ", err);
            }  else {
                res.json(data);
            }
        });
    },

    getForYear: function(req, res){
        var par = req.params.build;
        dataMonthly.find({code:par}, function(err, data){
            if (err) {
                console.log("ERR: ", __filename, "func: getForYear");
                console.log("Error getting data from dataMonthly: ", err);
            }  else {
                res.json(data);
            }
        });
    },

    testdb: function() {
        dataHour.find({date: todayDate}, function(err, data){
            console.log(data.length + " items read from collection dataHour.");
        });


        dataDaily.find({}, function(err, data){
            console.log(data.length + " items read from collection dataDaily.");
        });

        dataMonthly.find({}, function(err, data){
            console.log(data.length + " items read from collection dataMonthly.");
        });
    }
}