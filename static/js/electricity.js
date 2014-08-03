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
                            console.log(hrO, hr, tmp, data[x]);
                    } else {
                        data[x] = msg[i].value;
                        x++;
                        console.log("getHours(): ajax() responded, msg length: ", msg.length);
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
            console.log("getConsumption(): ajax() responded, msg length: ", msg.length);
        }
    });
    return data;
}

function campusConsumption() {
    var total = getConsumption();
    $('#totalM').append('<span style="color:green">' + total + "</span> KWH so far today");
    $('#totalE').append('<span style="color:green">' + total + "</span> KWH so far today");
    $('#totalC').append('<span style="color:green">' + total + "</span> KWH so far today");
}


function loadToday(date, code, building) {
    var values = getHours(date, code);
    var accum = 0;

    for (var j = 0; j < 47; j++) {
        if(values[j] != null){
            accum += values[j];
        } else {
            values[j] = null;
        }
    }

    var max = Math.max.apply(null,values);
    console.log("loading " + date +" for: ", code);
    $('#kwh').html('<b><i>kwh so far today</b></i>');
    $('#ghg').html('<b><i>kg of eCO2 so far today</b></i>');
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
    var accum = 0;
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
    $('#kwh').html('<b><i>kwh so far this week</b></i>');
    $('#ghg').html('<b><i>kg of eCO2 so far this week</b></i>');
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
    var accum = 0;
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
    console.log("loading Month for: ", code);
    $('#kwh').html('<b><i>kwh so far this month</b></i>');
    $('#ghg').html('<b><i>kg of eCO2 so far this month</b></i>');
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
    var accum = 0;
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
    $('ghg').html('<b><i>kg of eCO2 so far this year</b></i>');
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

function loadGraph(date, code, name){
    var total = 0;
    $('.graph-name p').show();
    // for (var i = 0; i < buildings.length; i++) {
        if (date === "yesterday" ) {
            total = loadToday(yesterdayDate, code, name);
        }
        if (date === "today" ) {
            total = loadToday(todayDate, code, name);
        }
        if (date === "week" ) {
            total = loadWeek(todayDate, code, name);
        }
        if (date === "month" ) {
            
            total = loadMonth(todayDate, code, name);
        } 
        if (date === "year" ) {
            
            total = loadYear(code, name);
        }
    // }
    var chart = new Highcharts.Chart(options);
    chart.showLoading();
    setTimeout(function(){
        chart.hideLoading();    
    }, 1000);

    return total;
};

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
function loadBuildingsList_electricity() {
    var list = getBuildings();
    var builds = list.sort(dynamicSort("name"));
    for (var i = 0; i < builds.length; i++) {
        
        if (builds[i].type === "academic") {
            console.log(builds[i].name);
            $('#tab1').append('<a rel="' + builds[i].code + '" class="' + builds[i].available + '" href="#"><img src=\"' + builds[i].image 
                + '" value="' + builds[i].name + '"/><p>' + builds[i].name + '</p></a>');
        } else if (builds[i].type === "residence") {
            console.log(builds[i].name);
            $('#tab2').append('<a rel="' + builds[i].code + '" class="' + builds[i].available + '" href="#"><img src=\"' + builds[i].image 
                + '" value="' + builds[i].name + '"/><p>' + builds[i].name + '</p></a>');
        }
    };
}

var state = false;
function buil_loader(tab, code, name) {
    
    $('#container').animate({opacity:0});
    $('#noData').hide(); 
    $('.col3').hide();
    $('.midBox').hide(100);
    $('.col1E').animate({ 'margin-left': "-37px" }, 500);
    $('.el').show();
    var buildings = getBuildings();
    for (var i = 0; i < buildings.length; i++) {
        if (code === buildings[i].code) {
            $('.spin > p').html('Loading <br />' + buildings[i].name);
            $('.graph-name p').html(buildings[i].name);
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
        for (var i = 0; i < buildings.length; i++) {
            if (code === buildings[i].code && buildings[i].available === "Active") {
                found = true;
                break;
            }
            else {
                found = false;
            }
        }
        if (found == true) {
            var total = loadGraph("today", code , name);
            state = true;
            
            $('.graph-name').show("clip");
            $('#container').animate({opacity:1}, 500);
            $('#buttons').show();
            $('.col3').show();
            $('#r-img').show("blind");
            $('.total-box').show();
            $('.builProfile').show("slide", 100);
            var counter = $(".total-box #num1");
            counter.animateNumber(total.toFixed(0));
            var counter = $(".total-box #num2");
            var ghg = total * ghgVal;
            counter.animateNumber(ghg.toFixed(0));
            $("#spin").hide(10);
            
        }
        else {
            $('.graph-name').show();
            $('.graph-name p').show();
            $('#noData').show();
            $('.col3').show();
            $('#r-img').show("blind");
            $("#spin").hide(10);  
            $('.builProfile').show("slide", 100);   
        }
    }, 4000);
    state = true;
    var info = getBuildingsInfo(code);
    $('#info').html("<b>Profile: </b>" + info[0].profile + "<br/><b>Size: </b>" + parseFloat(info[0].size) + " sq. ft" +
        "<br/><b>Built/Renovated: </b>" + info[0].built + "/" + info[0].renovated + "<br/><b>Feature: </b>" + info[0].feature);
    
    
    $('#today').addClass('ui-state-highlight');
    $('#week').removeClass('ui-state-highlight');
    $('#month').removeClass('ui-state-highlight');
    $('#year').removeClass('ui-state-highlight');
    $('#yesterday').removeClass('ui-state-highlight');
}

function loadFromMap(buil) {
    console.log(buil);
    var buildings = getBuildings();
    for (var i = 0; i < buildings.length; i++)
    {console.log("loadFromMap: " + buildings[i].code, buil.id);
        // var ch_la = choiceList_acs[i].value;
        if (buildings[i].code === buil.id) { 
            
            buil_loader("#contentE #tab1" , buildings[i].code, buildings[i].name);
        
            bui = buildings[i].code;
            if (buildings[i].type === "residence") {
                $("#contentE #tab2").hide();
                $("#tabs>li>a").eq(1).removeClass("current");
                $(".elect>li>a").eq(0).addClass("current");
                $("#contentE #tab1").trigger('click');
                $("#contentE #tab1").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
            } else if (buildings[i].type === "academic") { 
                $("#contentE #tab1").hide();
                $("#tabs>li>a").eq(0).removeClass("current");
                $(".elect>li>a").eq(1).addClass("current");
                $("#contentE #tab2").trigger('click');
                $("#contentE #tab2").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
            }
        }
    }
}
// GHG emmission factor (see future work in the api for information)
var ghgVal = 0.798;

function buildElectricity(callback) {
    "use-strict";
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
                        }
                        currentTab = $(this).addClass('current').attr('name');
                        $("#contentE #" + currentTab).show().jScrollPane({hideFocus:true, autoReinitialise: true});                        return false;
                    });
                    $("#contentE #" + a.attr('name')).hide();
                }
            );
        }
    );
    loadBuildingsList_electricity(); 
    $(".elect li:first a").addClass("current");
    $("#contentE #tab1").show().jScrollPane({hideFocus:true, reinitialise: true});

    // Remove inActive class from active buildings (TODO)
    // for (var i = 0; i < codes.length; i++) {
    //     $("#contentE #tab1 a").each(function(){
    //         if (codes[i] === $(this).attr('rel')) {
    //             $(this).removeClass("inActive");
    //         }
    //     });
    //     $("#contentE #tab2 a").each(function(){
    //         if (codes[i] === $(this).attr('rel')) {
    //             $(this).removeClass("inActive");
    //         }
    //     });
    // };
    
    $("#contentE #tab1 a").click(function(){
        building_code = $(this).attr("rel");
        building_name = $(this).text();
        console.log($(this).attr("rel") + $(this).text())
        buil_loader("#contentE #tab1" , $(this).attr("rel") , $(this).text());
    });
    $("#contentE #tab2 a").click(function(){
        buil_loader("#contentE #tab2" , $(this).attr("rel") , $(this).text()); 
        building_code = $(this).attr("rel");
        building_name = $(this).text();
    });
    $("#yesterday").on('click', function(){
        $('#yesterday').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight'); 
        
        var total = loadGraph("yesterday", building_code, building_name );
        console.log(total)
        $('.total-box').show();
        $('.builProfile').show();
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * ghgVal;
        counter.animateNumber(ghg.toFixed(0));

    });
    $("#today").on('click', function(){
        $('#today').addClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');
        
        
        var total = loadGraph("today", building_code, building_name );
        $('.builProfile').show("slide", 100);
        $('.total-box').show();
        console.log(total)
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * ghgVal;
        counter.animateNumber(ghg.toFixed(0));

    });
    $("#week").on('click', function(){
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').addClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');

        var total = loadGraph("week", building_code, building_name );
        $('.total-box').show();
        $('.builProfile').show("slide", 100);

        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * ghgVal;
        counter.animateNumber(ghg.toFixed(0));
    });
    $("#month").on('click', function(){
        $('#month').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight');

        var total = loadGraph("month", building_code, building_name );
        $('.total-box').show();
        $('.builProfile').show("slide", 100);
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * ghgVal;
        counter.animateNumber(ghg.toFixed(0));
    });

    $("#year").on('click', function(){
        $('#year').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#yesterday').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        var total = loadGraph("year", building_code, building_name );
        $('.total-box').show();
        $('.builProfile').show("slide", 100);
        var counter = $(".total-box #num1");
        counter.animateNumber(total.toFixed(0));
        var counter = $(".total-box #num2");
        var ghg = total * ghgVal;
        counter.animateNumber(ghg.toFixed(0));
    });
    $('#today').addClass('ui-state-highlight');
    $('#yesterday').removeClass('ui-state-highlight');
    $('#week').removeClass('ui-state-highlight');
    $('#month').removeClass('ui-state-highlight');
    // TODO move to appropriate place
    campusConsumption();
    // callback();
};