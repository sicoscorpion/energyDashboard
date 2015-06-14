$.fn.animateNumber = function(to) {
    var $ele = $(this),
        num = 0,
        up = to > num,
        num_interval = to / 10;

    var loop = function() {
        num = Math.floor(up ? num+num_interval: num-num_interval);
        if ( (up && num > to) || (!up && num < to) ) {
            num = to;
            var array = num.toString().split('');
            var index = -3;
            while (array.length + index > 0) {
                array.splice(index, 0, ',');
                // Decrement by 4 since we just added another unit to the array.
                index -= 4;
            }
            num = array.join('');
            clearInterval(animation)
        }
        $ele.html(num);
    }

    var animation = setInterval(loop, 50);
}
function campusConsumption() {
    var total = getConsumption();
    $('#totalM').append('<span style="color:green">' + total + "</span> KWH so far today");
    $('#totalE').append('<span style="color:green">' + total + "</span> KWH so far today");
    $('#totalC').append('<span style="color:green">' + total + "</span> KWH so far today");
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function makeid()
{
    var text = "";
    var possible = "0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
