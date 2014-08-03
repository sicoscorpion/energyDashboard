/* 
    checks out (and assign if nessasary) the db-Dashboard schemas, and handle all the routing 
    TODO usage
*/

var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var dateable = require('dateable');

var extras = require('../helpers/extras.js');
var models = require('../models/energy.js');
var buildings = require('../models/buildings.js');

var list = ['dataHour', 'dataDaily', 'dataMonthly'];
var db_list = ['DH', 'DD', 'DM'];
var BuildingsCodes = ["SEM", "SM2", "CRO", "EAT", "CHI", "UNH", "RHO", "SUB", "BAC", "WHI", "MAN",
"CUT", "RRG", "HOR", "VML", "VM2", "DEN", "WMH", "WIL", "CAR", "HSH", "EMM", "ELL"];


var dataHour = Mongoose.model('dataHour');
var dataDaily = Mongoose.model('dataDaily');
var dataMonthly = Mongoose.model('dataMonthly');
var Buildings = Mongoose.model('buildings');

// Buildings.findOne({}, function(err, data) {
//     console.log(data);
// });

function calculateCampus() { return function (callback, errback) {
    var today = new Date();
    var todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
    
    var total = 0;
    // var h = extras.addZero(today.getHours()-1);
    // var m = '00';
    // var s = '00';
    // var t_now = h + ':' + m  + ':' + s;
    // console.log(t_now);
    dataHour.find({date: todayDate}, function(err, data){
        if (err) {
            console.log("ERR: ", __filename, "func: campusConsumption");
            console.log("Error getting data from dataHour: ", err);
        }  else {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < BuildingsCodes.length; j++) {
                    if (data[i].code === BuildingsCodes[j]) {
                        total += data[i].value;
                        // console.log(data[i].value);
                    }
                };
                
            };
            callback(total);
        }
    });    
}}


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

    getBuildings: function(req, res) {
        Buildings.find({}, function(err, data) {
            if (err) {
                console.log("ERR: ", __filename, "func: getBuildingInfo");
                console.log("Error getting data from Buildings: ", err);
            }  else {
                // console.log(data)
                res.json(data);
            }
        });
    },

    getBuildingInfo: function(req, res) {
        var par = req.params.build;
        Buildings.find({code: par}, function(err, data) {
            if (err) {
                console.log("ERR: ", __filename, "func: getBuildingInfo");
                console.log("Error getting data from Buildings: ", err);
            }  else {
                // console.log(data)
                res.json(data);
            }
        });
    },

    campusConsumption: function(req, res) {
        calculateCampus()(function(data) {
            // console.log(data);
            res.json(data);
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