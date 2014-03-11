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
            for (var i = 0, x = 0; i < msg.length; i++) {
                if (msg[i].code === b ){
                    data[x] = msg[i].value;
                    x++;
                    console.log("Getting Hours correctly");
                }
                else continue;
            }
        }
    });
    console.log(data);
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
                            console.log("WEEK ", new Date(thisWeek[j]));
                            if(((new Date(msg[i].date)) - (new Date(thisWeek[j]))) == 0 ) {
                                data[j] = msg[i].value;
                                console.log("WEEK ", msg[i].date, new Date(thisWeek[j]));
                            }

                            else if (!data[j]) {
                                data[j] = null;
                            }
                        }
                    } else continue;
                } 
            }
        }
    });
    console.log(data);
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
        }
    });
    console.log(data);
    return data;
}

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
        }
    });
    console.log(data);
    return data;
}

function campusConsumption() {
    var total = getConsumption();
    $('#total').append('<span style="color:green">' + total + "</span> KWH so far today");
    console.log(total);
}


var accum = 0
function loadToday(date, code, building) {
    var values = getHours(date, code);
    accum = 0;

    for (var j = 0; j < 47; j++) {
        if(values[j] != null){
            accum += values[j];
        } else {
            values[j] = null;
        }
    }

    var max = Math.max.apply(null,values);
    console.log("loading " + date +" for: ", code);
    console.log(values);
    $('#kwh').html('<b><i>kwh so far today</b></i>');
    $('#ghg').html('<b><i>kg of CO2 so far today</b></i>');
    $('.graph-name p').html(building);
    options.chart = {
        renderTo: 'container',
        width: 565,
        height: 335,
        shadow: true,
        defaultSeriesType: 'area'
    }
    options.title = {
        align: 'left',
        text : "<b>Electricity Use (kw)</b> ",
        style: {
            color: 'black',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'black'
        }
    }
    options.xAxis ={
        type: 'datetime',
        labels: {
            formatter: function() {
                for (var i = 0; i < 24; i++) {
                    return Highcharts.dateFormat('%I%P', this.value);
                };
                // return Highcharts.dateFormat('%I%P', this.value);
            },
            style: {
                // fontWeight: 'bold'
                color: 'black'
            },
            rotation: -45,
            y: 20,
            x: 4
        },
        endOnTick: false,
        startOnTick: false,
        enabled: true,
        minRange: 1800000
    }
    options.yAxis = {
        max: max * 1.5,
        title: false,
        labels: {
            style: {
                color: 'black'
            }
        }
    }
    options.tooltip = {
        formatter: function(){
            return Highcharts.dateFormat('%I:%M%p', this.x) + "<br/>" + "<b>" + this.y + "</b>" + " kw";
        },
        style: {
            color: 'black'
        }
    }
    options.series = [{
        name: code, 
        data: values,
        color: '#ffad00',
        marker: {
            enabled: false  
        },
        pointStart: Date.UTC(year, month-1, day),
        pointInterval: 1800000                   
    }]
    return accum;
}

function loadWeek(todayDate, code, building) {
     $('.graph-name p').html(building);
    var vl = getDays(code, "w");
    accum = 0;
    for (var j = 0; j < 7; j++) {
        if(vl[j] != null){
            accum += vl[j];
        } else {
            if (vl[j-1] != null && vl[j+1] == null || vl[2] == null){               
                var current = getHours(todayDate, code);
                var total = 0;
                for (var m = 0; m < current.length; m++) {
                    if(current[m] != null){
                        total += current[m];
                    } else {
                        current[m] = null;
                    }
                }
                vl[j] = total;
                accum += vl[j];
                break;
            }
        }
    }
    console.log("loading Week for:", code);
    console.log(vl);
    $('#kwh').html('<b><i>kwh so far this week</b></i>');
    $('#ghg').html('<b><i>kg of CO2 so far this week</b></i>');
    var max = Math.max.apply(null,vl);
    options.chart = {
        renderTo: 'container',
        defaultSeriesType: 'column',
        width: 565,
        height: 335,
        shadow: true,
        animation: {
            duration: 1000
        }
    }
    options.title = {
        align: 'left',
        text : "<b>Electricity Use (kwh)</b> ",
        style: {
            color: 'black',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'black'
        }
    }
    options.tooltip = {
        formatter: function(){
            return "<b>" + this.y + "</b>" + " kwh";
        },
        style: {
            color: 'black'
        }
    }
    options.xAxis = {
        labels: {
            style: {
                color: 'black'
            },
            rotation: -45,
            y: 20,
            x: 4
        },
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        endOnTick: false,
        startOnTick: false,
        enabled: true
    }
    options.yAxis = {
        max: max * 1.2,
        title: false,
        labels: {
            style: {
                color: 'black'
            }
        }
    }
    options.lang = {
        loading: "loading..."
    }
    options.series = [{
        name: code,
        animation: false, 
        data: vl,
        color: '#ffad00',
        marker: {
            enabled: false  
        }              
    }]
    return accum;
}

function loadMonth(todayDate, code, building) {
    var vMonth = getMonth(code, "m");
    
    accum = 0;
    for (var j = 0; j < thisMonth.length -1; j++) {
        if(vMonth[j] != null){
            accum += vMonth[j];
        } else {
            if (vMonth[j-1] != null && vMonth[j+1] == null || vMonth[2] == null){               
                var current = getHours(todayDate, code);
                var total = 0;
                for (var m = 0; m < current.length; m++) {
                    if(current[m] != null){
                        total += current[m];
                    } else {
                        current[m] = null;
                    }
                }
                vMonth[j] = total;
                accum += vMonth[j];
                break;
            }
        }
    }
    var vMonth2 = new Array()
    for (var i = 0; i < vMonth.length; i++) {
        if(i == 0)
            vMonth2[0] =null;

        vMonth2[i+1] = vMonth[i];
    };
    var max = Math.max.apply(Math, vMonth2);
    console.log(max);
    console.log("loading Month for: ", code);
    $('#kwh').html('<b><i>kwh so far this month</b></i>');
    $('#ghg').html('<b><i>kg of CO2 so far this month</b></i>');
    options.chart = {
        renderTo: 'container',
        defaultSeriesType: 'column',
        width: 565,
        height: 335,
        shadow: true
    }
    options.title = {
        align: 'left',
        text : "<b>Electricity Use (kwh)</b> ",
        style: {
            color: 'black',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'black'
        }
    }
    options.tooltip = {
        formatter: function(){
            return "<b>" + this.y + "</b>" + " kwh";
        },
        style: {
            color: 'black'
        }
    }
    options.xAxis = {
        labels: {
            style: {
                color: 'black'
            },
            rotation: -45,
            y: 20,
            x: 4
        },
        categories: vMonth.length,
        max:vMonth.length,
        min:1,
        endOnTick: true,
        startOnTick: true,
        enabled: true
    }
    options.yAxis = {
        max: max * 1.2,
        title: false,
    }
    options.lang = {
        loading: "loading..."
    }
    options.series = [{
        name: code, 
        animation: false,       
        data: vMonth2,
        color: '#ffad00',            
    }]
    return accum;
}

function loadYear(code, building) {
     $('.graph-name p').html(building);
    var vl = getYear(code);
    accum = 0;
    var v2 = getMonth(code);
    for (var i = 0; i < v2.length; i++) {
        accum += v2[i];
    };
    vl[parseInt(today.getMonth())] = accum;
    for (var j = 0; j < vl.length; j++) {
        accum += vl[j];
    };
    console.log("loading Year for:", code);
    $('#kwh').html('<b><i>kwh so far this year</b></i>');
    $('ghg').html('<b><i>kg of CO2 so far this year</b></i>');
    var max = Math.max.apply(null,vl);
    options.chart = {
        renderTo: 'container',
        defaultSeriesType: 'column',
        width: 565,
        height: 335,
        shadow: true
    }
    options.title = {
        align: 'left',
        text : "<b>Electricity Use (kwh)</b>",
        style: {
            color: 'black',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'black'
        }
    }
    options.tooltip = {
        formatter: function(){
            return "<b>" + this.y + "</b>" + " kwh";
        },
        style: {
            color: 'black'
        }
    }
    options.xAxis = {
        labels: {
            style: {
                color: 'black'
            },
            rotation: -45,
            y: 20,
            x: 4
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        endOnTick: false,
        startOnTick: false,
        enabled: true
    }
    options.yAxis = {
        max: max * 1.2,
        title: false,
        labels: {
            style: {
                color: 'black'
            }
        }
    }
    options.lang = {
        loading: "loading..."
    }
    options.series = [{
        name: code,
        animation: false, 
        data: vl,
        color: '#ffad00',              
    }]
    return accum;
}

var options = {
    chart: {
        width: 600
    },
    
    legend: {
        enabled: false
    },
    title: {
        text: 'ENERGY CONSUMPTION'
    },
    credits: {
        enabled: false
    },
    exporting: {
         buttons: {
            contextButton: {
                enabled: false
            },
            exportButton: {
                text: 'Download',
                // Use only the download related menu items from the default context button
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.splice(2),
                onclick: function() {
                    this.exportChart({filename: today}, null);
                }
            },
            printButton: {
                text: 'Print',
                onclick: function () {
                    this.print();
                }
            }
        }
    },
    loading: {
        hideDuration: 1000,
        showDuration: 1000
    },
    navigation: {
        buttonOptions: {
            theme: {
                'stroke-width': 1,
                stroke: 'silver',
                r: 0,
                states: {
                    hover: {
                        fill: '#ffad00'
                    },
                    select: {
                        stroke: '#039',
                        fill: '#ffad00'
                    }
                },
                style: {
                    color: '#000',
                }
            }
        },
        menuItemStyle: {
            fontWeight: 'normal',
            background: 'none'
        },
        menuItemHoverStyle: {
            fontWeight: 'bold',
            background: 'none',
            color: 'black'
        }
    }
    
};

var codes_all = ['AAC', 'ALH', 'BAC', 'BIO', 'CAR', 'CHA' ,'CHI' ,'CRO' ,'CUT' ,'DEN' ,'EAT' ,'ELL' ,
'EMM' ,'FOU' ,'FTB' ,'HDH' ,'HOR' ,'HSH' ,'KCI' ,'MAN' ,'PAT' ,'RHO' ,'RJH' ,'RRG' ,'SEM' , 'SM2','SUB' ,'UNH' ,'VML' ,'WHE' ,'WIL' ,'WMH'];

var buildings_all = ['Arena/Gymnasium', 'Alumni Hall', 'Beveridge Arts Centre', 'Biology Building' ,'Carnegie Hall' ,'Chase Court' ,'Chipman House' ,'Crowell Tower' ,'Cutten House' ,
'Dennis House' , 'Eaton House' ,'Elliott Hall' ,'Emmerson Hall' ,'Fountain Commons' ,'Festival Theatre Building' ,'Harvey Denton Hall' ,'Horton Hall' ,'Huggins Science Hall' ,
'K. C. Irving Centre' , 'Manning Memorial Chapel', 'Patterson Hall' , 'Rhodes Hall', 'Roy Jodrey Hall', 'Services Building Garage', 'Seminary House' , 'School of Education', 
'Students\' Union Building' ,'University Hall' ,'Vaughan Memorial Library' 
,'Wheelock Dining Hall' ,'Willett House' ,'War Memorial House'];

var codes = ['UNH', 'SM2', 'EAT', 'RHO', 'SUB', 'BAC', 'CUT', 'RRG', 'HOR', 'VML', 'VM2'
    , 'DEN', 'WIL', 'HSH', 'EMM', 'ELL', 'CAR', 'CRO', 'MAN', 'SEM', 'CHI'];

var buildings = ['University Hall', 'School of Education', 'Eaton House', 'Rhodes Hall', 
'Students\' Union Building', 'Beveridge Arts Centre', 'Cutten House', 'Services Building Garage',
'Horton Hall', 'Vaughan Memorial Library', 'VM2', 'Dennis House',
'Willett House', 'Huggins Science Hall', 'Emmerson Hall', 'Elliott Hall', 'Carnegie Hall', 
'Crowell Tower', 'Manning Memorial Chapel', 'Seminary House', 'Chipman House' ];

function loadGraph(d, b){
    var total = 0;
    $('.graph-name p').show();
    console.log("called load graph");
    for (var i = 0; i < codes.length; i++) {
        if (d === "yesterday" && b === codes[i]) {
            total = loadToday(yesterdayDate, b, buildings[i]);
        }
        if (d === "today" && b === codes[i]) {
            total = loadToday(todayDate, b, buildings[i]);
        }
        if (d === "week" && b === codes[i]) {
            total = loadWeek(todayDate, b, buildings[i]);
            console.log("Called", i);
        }
        if (d === "month" && b === codes[i]) {
            
            total = loadMonth(todayDate, b, buildings[i]);
        } 
        if (d === "year" && b === codes[i]) {
            
            total = loadYear(b, buildings[i]);
        }
    }
    var chart = new Highcharts.Chart(options);
    chart.showLoading();
    setTimeout(function(){
        chart.hideLoading();    
    }, 1000);

    return total;
};

var choiceList = [
    {text: "University Hall", value: "UNH", info: "<b>Profile</b>: University Hall<br/><b>Size</b>: 50,744 sq.ft<br/><b>Built/Renovated</b>: 1924/1967<br/><b>Feature</b>: "},
    {text: "School of Education", value: "SM2", info: "<b>Profile</b>: School of Education<br/><b>Size</b>:  sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Eaton House", value: "EAT", info: "<b>Profile</b>: Eaton House<br/><b>Size</b>: 25,084 sq.ft<br/><b>Built/Renovated</b>: 1965/2001<br/><b>Feature</b>: "},
    {text: "Rhodes Hall", value: "RHO", info: "<b>Profile</b>: Rhodes Hall<br/><b>Size</b>: 11,765 sq.ft<br/><b>Built/Renovated</b>: 1912/1974<br/><b>Feature</b>: "},
    {text: "Students' Union Building", value: "SUB", info: "<b>Profile</b>: Students' Union Building<br/><b>Size</b>: 63,242 sq.ft<br/><b>Built/Renovated</b>: 1949/1991<br/><b>Feature</b>: "},
    {text: "Beveridge Arts Centre", value: "BAC", info: "<b>Profile</b>: Beveridge Arts Centre <br/><b>Size</b>: 103,160 sq.ft<br/><b>Built/Renovated</b>: 1977/ <br/><b>Feature</b>: "},
    {text: "Cutten House", value: "CUT", info: "<b>Profile</b>: Cutten House <br/><b>Size</b>: 85,100 sq.ft<br/><b>Built/Renovated</b>: 1975/ <br/><b>Feature</b>: "},
    {text: "Services Building Garage", value: "RRG", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Horton Hall", value: "HOR", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Vaughan Memorial Library", value: "VML", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: " VM2", value: "VM2", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Dennis House", value: "DEN", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "War Memorial House", value: "WMH", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Willett House", value: "WIL", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Huggins Science Hall", value: "HSH", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Emmerson Hall", value: "EMM", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Elliott Hall", value: "ELL", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Carnegie Hall", value: "CAR", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Crowell Tower", value: "CRO", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Manning Memorial Chapel", value: "MAN", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Seminary House", value: "SEM", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "},
    {text: "Chipman House", value: "CHI", info: "<b>Profile</b>: <br/><b>Size</b>: sq.ft<br/><b>Built/Renovated</b>: <br/><b>Feature</b>: "}
];
var choiceList_acs = [
    {text: "University Hall", value: "UNH", description: "UHALL"},
    {text: "School of Education", value: "SM2"},
    {text: "Rhodes Hall", value: "RHO" },
    {text: "Students' Union Building", value: "SUB"},
    {text: "Beveridge Arts Centre", value: "BAC"},
    {text: "Services Building Garage", value: "RRG"},
    {text: "Horton Hall", value: "HOR"},
    {text: "Vaughan Memorial Library", value: "VML"},
    {text: " VM2", value: "VM2"},
    {text: "Willett House", value: "WIL"},
    {text: "Huggins Science Hall", value: "HSH"},
    {text: "Emmerson Hall", value: "EMM"},
    {text: "Elliott Hall", value: "ELL"},
    {text: "Carnegie Hall", value: "CAR"},
    {text: "Manning Memorial Chapel", value: "MAN"},
    {text: "Biology Building", value: "BIO"},
    {text: "Fountain Commons", value: "FOU"},
    {text: "Harvey Denton Hall", value: "HDH"},
    {text: "K. C. Irving Centre", value: "KCI"},
    {text: "Patterson Hall", value: "PAT"},
    {text: "Wheelock Dining Hall", value: "WHE"}
]
var choiceList_res = [
    {text: "Eaton House", value: "EAT"},
    {text: "Cutten House", value: "CUT"},
    {text: "Dennis House", value: "DEN"},
    {text: "Crowell Tower", value: "CRO"},
    {text: "Seminary House", value: "SEM"},
    {text: "Chipman House", value: "CHI"},
    {text: "Chase Court", value: "CHA"},
    {text: "Roy Jodrey Hall", value: "RJH"},
    {text: "War Memorial House", value: "WMH"}
]

var state = false;
function buil_loader(tab, code) {
    
    $('#container').animate({opacity:0});
    $('#noData').hide(); 
    $('.col3').hide();
    $('.midBox').hide(100);
    $('.col1E').animate({ 'margin-left': "-37px" }, 500);
    $('.el').show();

    for (var i = 0; i < codes_all.length; i++) {
        if (code === codes_all[i]) {
            console.log(code, codes_all[i])
            $('.spin > p').html('Loading <br />' + buildings_all[i]);
            $('.graph-name p').html(buildings_all[i]);
        }
    }
    $("#spin").show();
    $('.total-box').hide();
    $('.builProfile').hide();
    $('#buttons').hide("drop", 100);
    $('.graph-name').hide("drop", 200);
    $('#r-img').hide("clip", 200);

    console.log("CALLED buil_loader");
    setTimeout(function(){
        
        var pic = "images/buildings/resized/" + code + ".jpg";
        console.log("picture from >" + pic);
        $('#r-img').css({'background': "url(" + pic + ")" + " 0 0px repeat-y"});
        var found = false;
        for (var i = 0; i < codes.length; i++) {
            if (code === codes[i]) {
                found = true;
                console.log("found data for " + codes[i]);
                break;
            }
            else {
                found = false;

                console.log("No data for building " + code)
            }
        }
        console.log(found)
        if (found == true) {
            var total = loadGraph("today", code);
            state = true;
            
            $('.graph-name').show("clip");
            $('#container').animate({opacity:1}, 500);
            $('#buttons').show();
            $('.col3').show();
            $('#r-img').show("blind");
            $('.total-box').show();
            $('.builProfile').show("slide", 100);

            // $('#head').html("<b>CONSUMPTION SUMMARY<b>");
            var counter = $(".total-box #num1");
            counter.animateNumber(total.toFixed(0));
            var counter = $(".total-box #num2");
            var ghg = total * 0.805;
            counter.animateNumber(ghg.toFixed(0));
            // $('#buttons-extra').show("clip");
            $("#spin").hide(10);
            
        }
        else {
            
            $('.graph-name').show();
            $('.graph-name p').show();
            // $('#container').animate({opacity:1}, 500);
            $('#noData').show();
            $('.col3').show();
            $('#r-img').show("blind");
            $("#spin").hide(10);
            
        }
               
    }, 4000);
    state = true;
    for (var i = 0; i < choiceList.length; i++) {
        // alert(code + " ss " + choiceList[i].value)
        if (choiceList[i].value === code) {
            // alert(code)
            $('#info').html(choiceList[i].info);
        }
    };
    
    $('#today').addClass('ui-state-highlight');
    // $('#kwh').addClass('ui-state-highlight');
    $('#week').removeClass('ui-state-highlight');
    $('#month').removeClass('ui-state-highlight');
    $('#year').removeClass('ui-state-highlight');
    $('#yesterday').removeClass('ui-state-highlight');
}

function loadFromMap(buil) {
    console.log(buil);
    var build = "";
    for (var i = 0; i < choiceList_acs.length; i++)
    {
        var ch_la = choiceList_acs[i].value;
        if (ch_la === buil.id) { 
            build = ch_la;
            console.log("loadFromMap: " + build);
            setTimeout(function(){
                buil_loader("#contentE #tab1" , build);
            }, 100);
            bui = build;
            $("#contentE #tab2").hide();
            $("#tabs>li>a").eq(1).removeClass("current");
            $(".elect>li>a").eq(0).addClass("current");
            $("#contentE #tab1").trigger('click');
            $("#contentE #tab1").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
        }
    }

    for (var i = 0; i < choiceList_res.length; i++)
    {
        var ch_la = choiceList_res[i].value;
        if (ch_la === buil.id) { 
            build = ch_la;
            console.log("loadFromMap: " + build);
            setTimeout(function(){
            buil_loader("#contentE #tab2" , build);
            }, 100);
            bui = build;
            $("#contentE #tab1").hide();
            $("#tabs>li>a").eq(0).removeClass("current");
            $(".elect>li>a").eq(1).addClass("current");
            $("#contentE #tab2").trigger('click');
            $("#contentE #tab2").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
        }
    }
}
var tt_S = 0;
function buildElectricity(buildingTest) {
    "use-strict";
    // alert("Running : buildElectricity() - " + tt_S);
    $('#today').button();
    $('#yesterday').button();
    $('#week').button();
    $('#month').button();
    $('#year').button();
    $('.midBox').show("clip", 200);
    $('.col1E').animate({'margin-left': "-10px" });
    $('#switch').click(function() {
        if ($('.el').is(":visible")){
            $('.el').hide();
            $('.midBox').show();
            $('.col1E').animate({ 'margin-left': "-10px" });
        }
    });
    $("#switch").hover(function(){
        $(this).animate({ 'margin-left': "20px" });
    }, function() {
        $(this).animate({ 'margin-left': "10px" });
    });

    $("#campus").animate({opacity:1});
    // $("#campus").show("drop", 200);
    $(".midBox img").show(400);
    $('.menu a').click(function() {
        if($("#spin").is(":visible")) {
            $("#spin").hide(10);  
        }
    });
    $('.buil_info').animate({opacity:0}, 100);

                                
    var x = 0;
    $('#tabs').each(
        function()
        {
            var currentTab, ul = $(this);
            $(this).find('a').each(
                function(i)
                {
                    var a = $(this).bind('click', function()
                    {
                        $("#contentE #tab1").hide();
                        $("#contentE #tab2").hide();
                        $("#tabs>li>a").removeClass("current");
                        if (currentTab) {
                            ul.find('a.current').removeClass('current');
                            $("#contentE #" + currentTab).hide();
                            console.log("currentTab" + currentTab)

                        }
                        currentTab = $(this).addClass('current').attr('name');
                        $("#contentE #" + currentTab).show().jScrollPane({hideFocus:true, autoReinitialise: true});                        return false;
                    });
                    $("#contentE #" + a.attr('name')).hide();
                }
            );
        }
    );

    $(".elect li:first a").addClass("current");
    $("#contentE #tab1").show().jScrollPane({hideFocus:true, reinitialise: true});
    $("#contentE #tab1 a").click(function(){
        
        console.log("Clicked", $(this).attr("rel"));
        bui = $(this).attr("rel");
        buil_loader("#contentE #tab1" , $(this).attr("rel"));
    });
    $("#contentE #tab2 a").click(function(){
        console.log("Clicked", $(this).attr("rel"));
        buil_loader("#contentE #tab2" , $(this).attr("rel")); 
        bui = $(this).attr("rel");
    });
    // }
    $("#yesterday").on('click', function(){
        $('#yesterday').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight'); 
        
        var total = loadGraph("yesterday", bui);
        $('.total-box').show();
        $('.builProfile').show();
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * 0.805;
        counter.animateNumber(ghg.toFixed(0));

    });
    $("#today").on('click', function(){
        // $('#container').animate({opacity:0}, 100);
        $('#today').addClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');
        
        
        var total = loadGraph("today", bui);
        $('.builProfile').show("slide", 100);
        $('.total-box').show();
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * 0.805;
        counter.animateNumber(ghg.toFixed(0));

    });
    $("#week").on('click', function(){
        // $('#container').animate({opacity:0}, 100);
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').addClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');

        var total = loadGraph("week", bui);
        $('.total-box').show();
        $('.builProfile').show("slide", 100);

        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * 0.805;
        counter.animateNumber(ghg.toFixed(0));
    });
    $("#month").on('click', function(){
        $('#month').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');

        var total = loadGraph("month", bui);
        $('.total-box').show();
        $('.builProfile').show("slide", 100);
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * 0.805;
        counter.animateNumber(ghg.toFixed(0));
    });

    $("#year").on('click', function(){
        $('#year').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        var total = loadGraph("year", bui);
        $('.total-box').show();
        $('.builProfile').show("slide", 100);
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * 0.805;
        counter.animateNumber(ghg.toFixed(0));
    });
    $('#today').addClass('ui-state-highlight');
    $('#yesterday').removeClass('ui-state-highlight');
    $('#week').removeClass('ui-state-highlight');
    $('#month').removeClass('ui-state-highlight');
    // TODO move to appropriate place
    campusConsumption();
};