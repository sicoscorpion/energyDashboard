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

var pkg = require('./package.json');
var cont = require('./controllers/energy.js');
var cronJob = require('cron').CronJob;
var config = require('./config.json');
var scheduler = require('./helpers/scheduler.js');
var passport = require('passport');
var pass = require('./helpers/passport.js');
var db = require('./helpers/db.js');
var admin = require('./controllers/admin.js');
/* environments configuration */
app.configure(function(){
    // app.use(express.logger());
    // var db = Mongoose.connect(config.db_address);
    app.set('development', process.env.PORT);
    
    
    app.use(express.errorHandler({
        dumpException: true,
        showStack: true
    }));
    app.use(express.favicon());
    app.set('views', __dirname + '/views'); // change to /views-dev to serv development views
    app.set('view engine', 'ejs');
    // app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/static')); // change to /views-dev to serv development static files
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

//  app.use(express.session());

//       // passport initialization
//       app.use(passport.initialize());
//       app.use(passport.session());

// app.configure('production', function(){
//     var db = Mongoose.connect('mongodb://localhost/dashboard');
//     app.set('port', process.env.PORT);
//     app.use(express.errorHandler()); 
//     app.use(express.favicon());
//     app.use(app.router);
//     app.set('views', __dirname + '/views');
//     app.engine('html', require('ejs').renderFile);
//     app.use(express.static(__dirname + '/static'));
// });



/* starts CRON jobs responsible for running the storing routine */
scheduler.main_job.start();
scheduler.backup_job.start();
/* routes */
app.get('/db/dataHour/:val/:build', cont.getPerHour);
app.get('/db/dataDaily/:from/:to/:build', cont.getPerDay);
app.get('/db/dataForWeek/:build', cont.getForWeek);
app.get('/db/dataForMonth/:build', cont.getForMonth);
app.get('/db/dataForYear/:build', cont.getForYear);
app.get('/db/campusConsumption', cont.campusConsumption);
app.get('/db/buildinginfo/:build', cont.getBuildingInfo);
app.get('/db/getBuildings', cont.getBuildings);
app.get('/db/getInterfaceInfo', cont.getInterfaceInfo);
app.get('/db/getCompetitions', cont.getCompetitions);

app.post('/login', admin.postlogin);
app.get('/manage', pass.ensureAuthenticated, admin.admin);
app.get('/logout', admin.logout);
app.post('/updateAccount', pass.ensureAuthenticated, admin.updateAccount);
app.post('/updateBuildingInfo', pass.ensureAuthenticated, admin.updateBuildingInfo);
app.post('/updateGHG', pass.ensureAuthenticated, admin.updateGHG);
app.post('/createCompetition', pass.ensureAuthenticated, admin.createCompetition);
app.post('/removeCompetition', pass.ensureAuthenticated, admin.removeCompetition);

app.get('/admin', function(req, res){
  // response.send('This is the restricted area! Hello ' + request.session.user + '! click <a href="/logout">here to logout</a>');
  res.render('admin', { user: req.user, message: req.session.messages, sess: "manager"});
});

app.get('/', function(req, res){   
    res.render('index.ejs', {
        env: process.env.NODE_ENV,
        ver: pkg.version,
        sess: "public"
    });
});

function errorHandler(client, conn) {
    conn.on('error', function(e) {
        console.log('Conn Error: ', e.stack)
    })
}
process.env.NODE_ENV = "development";
app.listen(process.env.PORT);
console.log("Acadia Energy Dashboard NodeJS server");
console.log("Server listening on port", process.env.PORT, "in", process.env.NODE_ENV, "environment.", "version:", pkg.version);
