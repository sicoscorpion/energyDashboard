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
   , dateable = require('dateable');

var pkg = require('./package.json');
var cont = require('./routes/controller.js');
var cronJob = require('cron').CronJob;

/* environments configuration */
app.configure('development', function(){
    // app.use(express.logger());
    var db = Mongoose.connect('mongodb://localhost/dashboard');
    app.set('porduction', process.env.PORT);
    
    
    app.use(express.errorHandler({
        dumpException: true,
        showStack: true
    }));
    app.use(express.favicon());
    app.use(app.router);
    app.set('views', __dirname + '/views'); // change to /views-dev to serv development views
    app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/static')); // change to /views-dev to serv development static files
});

app.configure('production', function(){
    var db = Mongoose.connect('mongodb://localhost/dashboard');
    app.set('port', process.env.PORT);
    app.use(express.errorHandler()); 
    app.use(express.favicon());
    app.use(app.router);
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/static'));
});

// scheduler for the storing routine
var job = new cronJob({
    cronTime: '10 * * * *',
    onTick: function(){
        require('./sys/storeData.js');
        setTimeout(function(){
            delete require.cache[require.resolve('./sys/storeData.js')];
        }, 9000);
        setTimeout(function(){
            delete require.cache[require.resolve('dateable')];
            dateable = require('dateable');
        }, 1000);
        console.log("Saved new set of data");
    },
    start: false
});

/* starts CRON jobs responsible for running the storing routine */
job.start();

/* routes */
app.get('/db/dataHour/:val/:build', cont.getPerHour);
app.get('/db/dataDaily/:from/:to/:build', cont.getPerDay);
app.get('/db/dataForWeek/:build', cont.getForWeek);
app.get('/db/dataForMonth/:build', cont.getForMonth);
app.get('/db/dataForYear/:build', cont.getForYear);
app.get('/db/campusConsumption', cont.campusConsumption);
app.get('/db/buildinginfo/:build', cont.getBuildingInfo);

app.get('/', function(req, res){   
    res.render('index.html', {
        env: process.env.NODE_ENV,
        ver: pkg.version
    });
});

function errorHandler(client, conn) {
    conn.on('error', function(e) {
        console.log('Conn Error: ', e.stack)
    })
}

app.listen(process.env.PORT);
console.log("Acadia Energy Dashboard NodeJS server");
console.log("Server listening on port", process.env.PORT, "in", process.env.NODE_ENV, "environment.", "version:", pkg.version);
