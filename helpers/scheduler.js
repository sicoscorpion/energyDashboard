var cronJob = require('cron').CronJob;

var job1 = new cronJob({
    cronTime: '10 * * * *',
    onTick: function(){
        require('./sys/storeData.js');
        var exec = require('child_process').exec;
        exec('/usr/bin/wget --quiet -P /home/zeratoul/data -np -nd -N -r -A *.csv http://131.162.197.184/data/',
            function(err,data) {
                console.log(err, data);
        });
        setTimeout(function(){
            delete require.cache[require.resolve('./sys/storeData.js')];
        }, 9000);
        console.log("Saved new set of data");
    },
    start: false
});

var job2 = new cronJob({
    cronTime: '27 * * * *',
    onTick: function(){
        require('./sys/storeData.js');
        var exec = require('child_process').exec;
        exec('/usr/bin/wget --quiet -P /home/zeratoul/data -np -nd -N -r -A *.csv http://131.162.197.184/data/',
            function(err,data) {
                console.log(err, data);
        });
        setTimeout(function(){
            delete require.cache[require.resolve('./sys/storeData.js')];
        }, 9000);
        console.log("Saved new set of data");
    },
    start: false
});
module.exports = {
 	main_job: job1,
 	backup_job: job2,
}