var express = require('express')
   , Mongoose = require('mongoose')
   , Schema = Mongoose.Schema
   , app = express()
   , dateable = require('dateable');

var cont = require('./routes/controller.js');
var cronJob = require('cron').CronJob;

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
    app.set('views', __dirname + '/views-dev');
    app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/static-dev'));
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


// console.log("server running in " + process.env.ENV_VARIABLE + " mode");

var job = new cronJob({
    cronTime: '10 * * * *',
    onTick: function(){
        require('./sys/storeData.js /home/cslab/DATA/');
        setTimeout(function(){
            delete require.cache[require.resolve('./sys/storeData.js /home/cslab/DATA/')];
        }, 9000);
        setTimeout(function(){
            delete require.cache[require.resolve('dateable')];
            dateable = require('dateable');
        }, 1000);
        console.log("Saved new data");
    },
    start: false
});

/* starts CRON jobs responsible for running the storing routine */
job.start;

/* routes */
app.get('/db/dataHour/:val/:build', cont.getPerHour);
app.get('/db/dataDaily/:from/:to/:build', cont.getPerDay);
app.get('/db/dataForWeek/:build', cont.getForWeek);
app.get('/db/dataForMonth/:build', cont.getForMonth);
app.get('/db/dataForYear/:build', cont.getForYear);



var frontPage = 'Welcome to the Acadia University Energy Dashboard.'

app.get('/', function(req, res){    
    // var browser = JSON.stringify(req.headers['user-agent']);
    // if(browser.slice(26,30) === "MSIE"){
        // res.render('ie.html');
    // } else {
        res.render('index.html', {
            // message: 'Yellop!'
            midText: frontPage
        });
    // }
    // console.log('User-Agent: ' + browser.slice(26, 30));
});

function errorHandler(client, conn) {
    conn.on('error', function(e) {
        console.log('Conn Error: ', e.stack)
    })
}

app.listen(process.env.PORT);
console.log("Server listening on port", process.env.PORT, "in", process.env.NODE_ENV);
