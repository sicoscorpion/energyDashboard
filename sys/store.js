var express = require('express')
   , Mongoose = require('mongoose')
   , Schema = Mongoose.Schema
   , app = express()
   , fs = require('fs')
   , dateable = require('dateable')
   , path = require('path')
   , config = require('../config.json');

// REMOVE THIS SHIT
var fileExistSync = require('./existsSync.js');
var parse = require('./parser.js');

var collections = ["dataHour", "Buildings", "hourly"];

var db = require('mongojs').connect('test', collections);
var dataProcessor = require('./dataProcessor.js');
var helpers = require('./helpers.js');

var dir = config.MEU_data;

var selectFilesAuto = function() {

  var today = new Date(2015, 0, 23),
  day = today.getDate(),
  month = today.getMonth() + 1,
  year = today.getFullYear();
  var todayDate = dateable.format(today, 'MMDDYYYY'); // Today's date formated.
  var todayDate_db = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated db.

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var dayY = yesterday.getDate(),
    monthY = yesterday.getMonth() + 1,
    yearY = yesterday.getFullYear();
  var yesterdayDate = dateable.format(yesterday, 'MMDDYYYY'); // Yesterday's date formatted;
  var yesterdayFile = yesterdayDate + "D.csv";
  var todayFile = todayDate + "D.csv";

  var files = {};
  // Directory containing the JC generated files
  var dir = config.MEU_data;
  var numOfFiles = fs.readdirSync(dir).length;
  if (numOfFiles < 2) {
    console.log("Not enough files in Directory: ", dir);
    setTimeout(function(){
      db.close();
    }, 1000);
    return;
  }
  
  incompleteFileToday = todayDate + "D_INCOMPLETE.csv";
  incompleteFileYesterday = yesterdayDate + "D_INCOMPLETE.csv";
  var exist = fileExistSync(path.resolve(dir, incompleteFileToday));

  if (exist) {
    console.log("Found Incomplete File: " + incompleteFileToday);
    var dataI = fs.readFileSync(path.resolve(dir, incompleteFileToday), 'utf-8');
    var hrI = parse.getFirstHour(dataI);
    var dataC = fs.readFileSync(path.resolve(dir, todayFile), 'utf-8');
    var hrC = parse.getFirstHour(dataC);
    if (parseInt(hrC) >= parseInt(hrI)) {
      if(!fileExistSync(path.resolve(dir, todayFile))) {
        console.log("File not Found");
        setTimeout(function(){
          db.close();
        }, 1000);
        return;
      }
      fileNew = todayFile;
      console.log("Reading from Main File");
    } else if (parseInt(hrC) < parseInt(hrI))  {
      fileNew = incompleteFileToday;
      console.log("Reading from Incomplete File!");
    }
  } else {
    console.log("No Incomplete files found for: " + todayDate);
    if(!fileExistSync(path.resolve(dir, todayFile))) {
      console.log("File not Found");
      setTimeout(function(){
        db.close();
      }, 1000);
      return;
    }
    fileNew = todayFile;
    console.log("Reading from Main File");
  }
  exist = fileExistSync(path.resolve(dir, incompleteFileYesterday));
  if (exist) {
    console.log("Found Incomplete File: " + incompleteFileYesterday);
    var dataI = fs.readFileSync(path.resolve(dir, incompleteFileYesterday), 'utf-8');
    var hrI = parse.getFirstHour(dataI);
    var dataC = fs.readFileSync(path.resolve(dir, yesterdayFile), 'utf-8');
    var hrC = parse.getFirstHour(dataC);
    if (parseInt(hrC) >= parseInt(hrI)) {
      if(!fileExistSync(path.resolve(dir, yesterdayFile))) {
        console.log("File not Found");
        setTimeout(function(){
          db.close();
        }, 1000);
        return;
      }
      fileOld = yesterdayFile;
      console.log("Reading from Main File");
    } else if (parseInt(hrC) < parseInt(hrI))  {
      fileOld = incompleteFileYesterday;
      console.log("Reading from Incomplete File!");
    }
    console.log("Reading from Incomplete File!");
  } else {
    console.log("No Incomplete files found for: " + yesterdayDate);
    if(!fileExistSync(path.resolve(dir, yesterdayFile))) {
      console.log("File not Found");
      setTimeout(function(){
        db.close();
      }, 1000);
      return;
    }
    fileOld = yesterdayFile;
    console.log("Reading from Main File");
  }
  files.dir = dir;
  files.fileNew = fileNew;
  files.fileOld = fileOld;
  files.numOfFiles = numOfFiles;
  return files;
}

if (process.argv.length > 2) {
  var numOfFiles = fs.readdirSync(dir).length;
  if (numOfFiles < 2) {
    console.log("Not enough files in Directory: ", dir);
    setTimeout(function(){
      db.close();
    }, 1000);
    return;
  }
  console.log("Reading from user defined files");
  var file = process.argv[2];
  var oldFile = process.argv[3];
  var rawFile = fs.readFileSync(path.resolve(file), 'utf-8');
  var oldRawFile = fs.readFileSync(path.resolve(oldFile), 'utf-8');

} else {
  var files = selectFilesAuto();
  console.log(files)
  var dir = files.dir;
  var fileNew = files.fileNew;
  var fileOld = files.fileOld;
  var numOfFiles = files.numOfFiles;
  console.log("Reading from automatically defined files");
}

var prepareHourlyData = function (callback){
  var hourlySet = dataProcessor.parseRawFile(rawFile);
  var prevHourlySet = dataProcessor.parseRawFile(oldRawFile);

  resultHourly = dataProcessor.calcHourly(hourlySet, prevHourlySet);

  helpers.getBuildingsList(function(buildings) {
    prep = dataProcessor.prepareHourly(resultHourly, buildings);
    callback(prep);
  });
}

var storeHourlyData = function (callback) {
  db.hourly.ensureIndex({"dateTime":1 , "location":1} , {unique : true , dropDups : true, sparse: true});

  prepareHourlyData(function (data) {
    db.hourly.insert(data, function (err, response) {
      if (err || !response) {
        if (err.code !== 11000){
          // onErr(error);
          console.log("Error Inserting data: ", err)
        } 
      }
      callback(err, response)
      db.close();
    }, {upsert: true});
  });
}


// storeHourlyData(function (err, res) {
  
// })