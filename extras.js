var dateable = require('dateable');

var today = new Date(),
    day = today.getDate(),
    month = today.getMonth() + 1,
    year = today.getFullYear();
todayDate = dateable.format(today, 'MM/DD/YYYY'); // Today's date formated.
module.exports = {
	getSunday: function (date) {
	    var day = date.getDay() || 7;  
	    if( day !== 1 ) 
	        date.setHours(-24 * (day)); 
	    return date;
	}
}   