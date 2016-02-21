/*
    Author: Fady Abdelmohsen
    App:    serv.js (Acadia Energy Dashboard NodeJS server)

    version: 0.6 Beta 
    
    Notes: To run this server refer to README.md

    TODO usage

*/

var express = require('express')
   , Mongoose = require('mongoose')
   , Schema = Mongoose.Schema
   , app = express()
   , dateable = require('dateable')
   , hash = require('pass').hash;
var errorhandler = require('errorhandler');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

var pkg = require('./package.json');
var cont = require('./controllers/energy.js');
var competitions = require('./controllers/competition.js');
var cronJob = require('cron').CronJob;
var config = require('./config.json');
var scheduler = require('./helpers/scheduler.js');
var passport = require('passport');
var pass = require('./helpers/passport.js');
var db = require('./helpers/db.js');
var admin = require('./controllers/admin.js');
var storeDataAuto = require('./sys/storeDataAuto.js');

/* environments configuration */

// process.env.NODE_ENV
var env = process.env.NODE_ENV || 'development';

if ('development' == env || 'remote' == env) {
    // app.use(express.logger());
    // var db = Mongoose.connect(config.db_address);
    
    
    app.use(errorhandler({
        dumpException: true,
        showStack: true
    }));
    // app.use(favicon(__dirname + '/public/favicon.ico'));
    // view engine setup
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');
        
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(logger('dev'));


    app.use(express.static(__dirname + '/static')); // change to /views-dev to serv development static files
    app.use(cookieParser());

    // app.use(express.methodOverride());
    app.use(session({ 
      secret: 'kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig', 
      resave: false,
      saveUninitialized: true
    }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions.
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(app.router);
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
}

var job1 = new cronJob({
    cronTime: '10 * * * *',
    onTick: function(){
        var exec = require('child_process').exec;
        exec('/usr/bin/wget --quiet -P /home/zeratoul/data -np -nd -N -r -A *.csv http://powerdump.acadiau.ca/aed_data/',
            function(err,data) {
              storeDataAuto.saveData();
              console.log(err, data);
            });
        console.log("Saved new set of data");
    },
    start: false
});

var job2 = new cronJob({
    cronTime: '25 * * * *',
    onTick: function(){
        var exec = require('child_process').exec;
        exec('/usr/bin/wget --quiet -P /home/zeratoul/data -np -nd -N -r -A *.csv http://powerdump.acadiau.ca/aed_data/',
            function(err,data) {
              storeDataAuto.saveData();
              console.log(err, data);
        });
        console.log("Saved new set of data");
    },
    start: false
});

var jobRemote = new cronJob({
    cronTime: '12 * * * *',
    onTick: function(){
        // storeDataAuto.saveData();

        console.log("Saved new set of data");
    },
    start: false
});

var jobRemoteBackup = new cronJob({
    cronTime: '22 * * * *',
    onTick: function(){
        // storeDataAuto.saveData();

        console.log("Saved new set of data");
    },
    start: false
});

var competitionsJobs = new cronJob({
  cronTime: '* * * * *',
  onTick: function(){
    console.log("Job####")
    competitions.updateInBasePeriod();
    competitions.updateInPendingPeriod();
    competitions.updateInActivePeriod();
    competitions.updateCompletedCompetitions();
    competitions.updateBuildingsScores();
  },
  start: true
});


// scheduler.main_job.start();
// scheduler.backup_job.start();
/* routes */
app.get('/api/dataHour/:val/:build', cont.getPerHour);
app.get('/api/dataDaily/:from/:to/:build', cont.getPerDay);
app.get('/api/dataForWeek/:build', cont.getForWeek);
app.get('/api/dataForMonth/:build', cont.getForMonth);
app.get('/api/dataForYear/:build', cont.getForYear);
app.get('/api/campusConsumption', cont.campusConsumption);
app.get('/api/buildinginfo/:build', cont.getBuildingInfo);
app.get('/api/getBuildings', cont.getBuildings);
app.get('/api/getInterfaceInfo', cont.getInterfaceInfo);
app.get('/api/getCompetitions', cont.getCompetitions);

app.post('/login', admin.postlogin);
app.get('/manage', pass.ensureAuthenticated, admin.admin);
app.get('/logout', admin.logout);
app.post('/updateAccount', pass.ensureAuthenticated, admin.updateAccount);
app.post('/updateBuildingInfo', pass.ensureAuthenticated, admin.updateBuildingInfo);
app.post('/updateGHG', pass.ensureAuthenticated, admin.updateGHG);
app.post('/createCompetition', pass.ensureAuthenticated, admin.createCompetition);
app.post('/updateCompetition', pass.ensureAuthenticated, admin.updateCompetition);
app.post('/removeCompetition', pass.ensureAuthenticated, admin.removeCompetition);

app.get('/admin', function(req, res){
  // response.send('This is the restricted area! Hello ' + request.session.user + '! click <a href="/logout">here to logout</a>');
  res.render('admin', { 
    user: req.user, 
    message: req.session.messages, 
    sess: "manager"
  });

});

app.get('/', function(req, res){   
    res.render('index.ejs', {
        env: process.env.NODE_ENV,
        ver: pkg.version,
        sess: "public"
    });
});

if (app.get('env') === 'development') {
  /* starts CRON jobs responsible for running the storing routine */
  job1.start();
  job2.start();
}

if (app.get('env') === 'remote') {
  /* starts CRON jobs responsible for running the storing routine */
  jobRemote.start();
  jobRemoteBackup.start();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
// process.env.NODE_ENV = "development";
// app.listen(process.env.PORT);
// console.log("Acadia Energy Dashboard NodeJS server");
// console.log("Server listening on port", process.env.PORT, "in", process.env.NODE_ENV, "environment.", "version:", pkg.version);
