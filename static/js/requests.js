function getBuildingsInfo(b) {
    "use strict";
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/buildingInfo/' + b,
        async: false, 
        success: function(msg){
            data = msg;
            // console.log(msg);
        }
    });
    return data;
}
function getBuildings() {
    "use strict";
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/getBuildings/',
        async: false, 
        success: function(msg){
            data = msg;
            // console.log(msg);
        }
    });
    return data;
}

function getCompetitions() {
    "use strict";
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/getCompetitions/',
        async: false, 
        success: function(msg){
            data = msg;
            // console.log(msg);
        }
    });
    return data;
}

function getInterfaceInfo() {
    "use strict";
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/getInterfaceInfo/',
        async: false, 
        success: function(msg){
            data = msg;
            // console.log(msg);
        }
    });
    return data;
}

function getHours(d, b) {
    "use strict";
    var str = d.replace(/\//g, "-");
    console.log(str);
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/dataHour/' + str + '/' + b,
        async: false, 
        success: function(msg){
            var tmp = new Array();
            for (var i = 0; i <= 48; i++) tmp[i] = 0;
            for (var i = 0, x = 0; i < msg.length; i++) {                
                // if (i >=1) 
                
                if (msg[i].code === b ){
                    if (msg[i].code === "ELL") {
                    //     if (i === 0) { 
                    //         data[x] = msg[i].value;
                    //         x++;
                    //     } else {
                        
                            var hrO = parseInt(msg[i].time.slice(3,6));
                            var hr = parseInt(msg[i].time.slice(0,2));
                            var g = 0
                            if (hr == 0) g = hr;
                            if (hrO > 0 && hrO <= 30) {
                                g = hr*2;
                            } else if (hrO > 30 && hrO <= 59) {
                                g = hr*2 + 1;
                            }
                            // tmp[g] += ;
                            if (data[x]) data[x] += msg[i].value;
                            // console.log(hrO, hr, tmp, data[x]);
                    } else {
                        data[x] = msg[i].value;
                        x++;
                        // console.log("getHours(): ajax() responded, msg length: ", msg.length);
                    }
                }
                else continue;
            }
            
        }
    });
    return data;
}

function getDays(b, m, date){
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataForWeek/' + b
        , async: false
        , success: function(msg){
            if (msg.length == 0) {
                for (var j = 0; j < thisWeek.length; j++) {
                    data[j] = null;
                }
            }
            for (var i = 0; i < msg.length; i++) {
                if (m === "w") {
                    if(msg[i].code === b){
                        for (var j = 0; j < thisWeek.length; j++) {
                            if(((new Date(msg[i].date)) - (new Date(thisWeek[j]))) == 0 ) {
                                data[j] = msg[i].value;
                            }

                            else if (!data[j]) {
                                data[j] = null;
                            }
                        }
                    } else continue;
                } 
            }
            console.log("getDays(): ajax() responded, msg length: ", msg.length);
        }
    });
    return data;
}

function getMonth(b, m){
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataForMonth/' + b
        , async: false
        , success: function(msg){
            if (msg.length == 0) {
                for (var j = 0; j < thisMonth.length; j++) {
                    data[j] = null;
                }
            }
            for (var i = 0; i < msg.length; i++) {
                if(msg[i].code === b){
                    for (var j = 0; j < thisMonth.length; j++) {
                        if (((new Date(msg[i].date)) - (new Date(thisMonth[j]))) == 0 ) {
                            data[j] = msg[i].value;
                        }
                        else if (!data[j])
                            data[j] = null;
                    }
                } else continue;
            }
            console.log("getMonth(): ajax() responded, msg length: ", msg.length);
        }
    });
    return data;
}

function getYear(b){
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataForYear/' + b
        , async: false
        , success: function(msg){
            console.log(msg);
            var x = 0;
            var d = new Date();
            console.log(d.getFullYear());
            for (var i = 0; i < msg.length; i++) {
                console.log(parseInt(msg[i].month))
                if (msg[i].year === String(d.getFullYear())) {
                    console.log(parseInt(msg[i].month));
                    data[parseInt(msg[i].month) - 1] = msg[i].value;
                    x++;
                }
            }
            if (x < 12) {
                for (var i = 0; i < 12; i++) {
                    if (!data[i])
                        data[i] = null;    
                }
            }
            console.log("getYear(): ajax() responded, msg length: ", msg.length);
        }
    });
    console.log(data);
    return data;
}

function getConsumption() {
    "use strict";
    var data = [];
    $.ajax({
        type: 'GET', 
        dataType: 'json',
        url: '/db/campusConsumption/',
        async: false, 
        success: function(msg){
            data = msg;
            console.log("getConsumption(): ajax() responded, msg length: ", msg.length);
        }
    });
    return data;
}
function readData(from, to, code) {
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: '/db/dataDaily/' + from + "/" + to + "/" + code
        , async: false
        , success: function(msg){
            for (var i = 0, x = 0; i < msg.length; i++) {
                if(msg[i].code === code) {
                    var d = new Date(msg[i].date);
                    var day = d.getUTCDate();
                    var month = d.getUTCMonth();
                    var year = d.getUTCFullYear();
                    data[x] = [Date.UTC(year, month, day) , msg[i].value];
                    x++;
                }
            }
        }
    });
    return data;
}