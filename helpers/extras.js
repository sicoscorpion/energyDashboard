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
	},
	addZero: function (i) {
	    if (i < 10) {
	      i="0" + i;
	    }
	    return i;
	},
	ObjectSize: function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	}
}   