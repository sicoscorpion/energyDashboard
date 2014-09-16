
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
    $('#kwh').html('kwh so far today');
    $('#ghg').html('kg of eCO2 so far today');
    $('.graph-name p').html(building);
    options.chart = {
        width: 570,
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
    $('#kwh').html('kwh so far this week');
    $('#ghg').html('kg of eCO2 so far this week');
    var max = Math.max.apply(null,vl);
    options.chart = {
        defaultSeriesType: 'column',
        width: 570,
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
            if (vMonth[j-1] != null && vMonth[j+1] == null || vMonth[1] == null){               
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
    console.log(accum)
    var vMonth2 = new Array()
    for (var i = 0; i < vMonth.length; i++) {
        if(i == 0)
            vMonth2[0] =null;
        vMonth2[i+1] = vMonth[i];
    };
    var max = Math.max.apply(Math, vMonth2);
    console.log("loading Month for: ", code);
    $('#kwh').html('kwh so far this month');
    $('#ghg').html('kg of eCO2 so far this month');
    options.chart = {
        defaultSeriesType: 'column',
        width: 570,
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
    $('#kwh').html('kwh so far this year');
    $('#ghg').html('kg of eCO2 so far this year');
    var max = Math.max.apply(null,vl);
    options.chart = {
        defaultSeriesType: 'column',
        width: 570,
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
    if (date === "yesterday" ) {
        total = loadToday(yesterdayDate, code, name);
        $('#kwh').html('kwh used yesterday');
        $('#ghg').html('kg of eCO2 used yesterday');
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
    $('#container').highcharts(options);
    var chart = $('#container').highcharts();
    chart.showLoading();
    setTimeout(function(){
        chart.hideLoading();    
    }, 1000);

    return total;
};

function loadBuildingsList_electricity() {
    var list = getBuildings();
    var builds = list.sort(dynamicSort("name"));
    var builds_inActive = [];
    for (var i = 0,j = 0; i < builds.length; i++) {
        if (builds[i].available === "Active") {
            if (builds[i].type === "academic") {
                
                $('#tab1').append('<a rel="' + builds[i].code + '" class="' + builds[i].available + '" href="#"><img src=\"' + builds[i].image 
                    + '" value="' + builds[i].name + '"/><p>' + builds[i].name + '</p></a>');
                // console.log(builds[i].name);
                
            } else if (builds[i].type === "residence") {
                // console.log(builds[i].name);
                $('#tab2').append('<a rel="' + builds[i].code + '" class="' + builds[i].available + '" href="#"><img src=\"' + builds[i].image 
                    + '" value="' + builds[i].name + '"/><p>' + builds[i].name + '</p></a>');
            }
        } else {
            builds_inActive[j] = builds[i];
            j++;
        }
    };
    for (var i = 0; i < builds_inActive.length; i++) {
        if (builds_inActive[i].type === "academic") {    
            $('#tab1').append('<a rel="' + builds_inActive[i].code + '" class="' + builds_inActive[i].available + '" href="#"><img src=\"' + builds_inActive[i].image 
                + '" value="' + builds_inActive[i].name + '"/><p>' + builds_inActive[i].name + '</p></a>');
            // console.log(builds_inActive[i].name);
            
        } else if (builds_inActive[i].type === "residence") {
            // console.log(builds_inActive[i].name);
            $('#tab2').append('<a rel="' + builds_inActive[i].code + '" class="' + builds_inActive[i].available + '" href="#"><img src=\"' + builds_inActive[i].image 
                + '" value="' + builds_inActive[i].name + '"/><p>' + builds_inActive[i].name + '</p></a>');
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
    }, 3000);
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


// GHG emmission factor (see future work in the api for information)
var info = getInterfaceInfo();
// console.log("Interface: " + info[0].ghg);
var ghgVal = info[0].ghg;

function loadButtons(building_code, building_name) {
    $("#yesterday").on('click', function(){
        $('#yesterday').addClass('ui-state-highlight');
        $('#today').removeClass('ui-state-highlight');
        $('#week').removeClass('ui-state-highlight');
        $('#month').removeClass('ui-state-highlight');
        $('#year').removeClass('ui-state-highlight'); 
        
        var total = loadGraph("yesterday", building_code, building_name );
        console.log(total)
        $('.total-box').show("blind", 1000);
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
        $('.total-box').show("blind", 1000);
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
        $('.total-box').show("blind", 1000);
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
        $('.total-box').show("blind", 1000);
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
        $('.total-box').show("blind", 1000);
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
}

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
    var building_code = "";
    var building_name = "";
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
    
    $("#contentE #tab1 a").click(function(){
        building_code = $(this).attr("rel");
        building_name = $(this).text();
        console.log($(this).attr("rel") + $(this).text())
        buil_loader("#contentE #tab1" , $(this).attr("rel") , $(this).text());
        loadButtons(building_code, building_name)
    });
    $("#contentE #tab2 a").click(function(){
        buil_loader("#contentE #tab2" , $(this).attr("rel") , $(this).text()); 
        building_code = $(this).attr("rel");
        building_name = $(this).text();
        loadButtons(building_code, building_name)
    });
    // TODO move to appropriate place
    campusConsumption();
    // callback();
};