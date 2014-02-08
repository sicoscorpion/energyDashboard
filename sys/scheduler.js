var cronJob = require('cron').CronJob;

var job = new cronJob({
    cronTime: '10 * * * *',
    onTick: function(){
        require('./storeData.js /home/cslab/DATA/');
        setTimeout(function(){
            delete require.cache[require.resolve('./storeData.js /home/cslab/DATA/')];
        }, 9000);
        setTimeout(function(){
            delete require.cache[require.resolve('dateable')];
            dateable = require('dateable');
        }, 1000);
        console.log("Saved new data");
    },
    start: false
});

module.exports = {
	start: function() {
		job.start();
	}
}