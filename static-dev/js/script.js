
function start(){ 
	$('.header_bg').css({left:-950}).stop().delay(100).animate({left:0},800,'easeOutExpo');
};

function showSplash(){
	setTimeout(function () {
		$('header').stop().animate({top:90},800,'easeOutExpo');
		$('.grad1').stop().animate({top:-150},800,'easeOutExpo');
	}, 200);
};

function hideSplash(){ 	
	//$('#menu_splash li.nav4').stop().animate({marginLeft:490, marginTop:333},800,'easeOutExpo', function(){ $('.menu_splash').css({display:'none'}); });
	$('header').stop().animate({top:12},800,'easeOutExpo');
	$('.grad1').stop().animate({top:-230},800,'easeOutExpo');
};

function hideSplashQ(){		
	$('header').css({top:12});
	$('.grad1').css({top:-230});
};

///////////////////

Date.prototype.format = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "/" + yyyy; 
};


var today = new Date(),
    day = today.getDate(),
    month = today.getMonth() + 1,
    year = today.getFullYear();
var todayDate = today.format(); // Today's date formated.
// console.log(todayDate);

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
var dayY = yesterday.getDate(),
    monthY = yesterday.getMonth() + 1,
    yearY = yesterday.getFullYear();
var yesterdayDate = yesterday.format(); // Yesterday's date formatted;

var newWeek = new Date();
var dayw = newWeek.getDay() || 7; // Get current day number, converting Sun. to 7
if( dayw !== 1 )                // Only manipulate the date if it isn't Mon.
    newWeek.setHours(-24 * (dayw - 1));   // Set the hours to day number minus 1
                                         //   multiplied by negative 24
// console.log(newWeek); // will be Monday
// console.log(newWeek.getMonth());
var week = newWeek.format();
console.log(week);
var thisWeek = new Array();
for (var i = 0; i < 7; i++) {
    if(i == 0)
        thisWeek[i] = week;
    else {
        var w = newWeek;
        w.setDate(newWeek.getDate() + 1);
        thisWeek[i] = w.format();
     }       
};
// console.log(thisWeek);
$.fx.interval = 10;


var fd = Date.today().clearTime().moveToFirstDayOfMonth();
var firstday = fd.toString("MM/dd/yyyy");
var firstdaynum = parseInt(firstday.slice(3,5));
console.log(firstdaynum);

var ld = Date.today().clearTime().moveToLastDayOfMonth();
var lastday = ld.toString("MM/dd/yyyy");
var lastdaynum = parseInt(lastday.slice(3,5));
console.log(lastdaynum);
var thisMonth = new Array();
for (var i = 0; i < lastdaynum; i++) {
    var dd_1 = new Date();
    dd_1.setDate(fd.getDate() + i);
    thisMonth[i] = dd_1.format(); 
};
console.log(thisMonth);


$(window).load(function() {											
	// scroll
	$('.scroll-pane').jScrollPane({
		showArrows: false,
		verticalGutter: 5,
		verticalDragMinHeight: 100,
		verticalDragMaxHeight: 100
	});	
	
    // $('#content>ul>li').onClick(location.reload());

     $("#contentE div").hide(); // Initially hide all content
      $("#tabs li:first").attr("id","current"); // Activate first tab
      $("#contentE div:first").fadeIn(); // Show first tab content
      
      $('#tabs a').click(function(e) {
          e.preventDefault();
          // console.log($(this).attr("name"));
          if ($(this).closest("li").attr("id") == "current"){ //detection for current tab
           return       
          }
          else{             
          $("#contentE div").hide(); //Hide all content
          $("#tabs li").attr("id",""); //Reset id's
          $(this).parent().attr("id","current"); // Activate this
          $('#' + $(this).attr('name')).fadeIn(); // Show content for current tab
          }
      });

	//content switch	
	$('#content>ul>li').eq(0).css({'visibility':'hidden'});	
	var content = $('#content');	
	content.tabs({
        show:1,
        preFu:function(_){
    	   _.li.css({display:'none',top:-2000});
		   //$('.main3').css({display:'none',opacity:0});
		   //$('.close').css({display:'none',opacity:0});
        },
        actFu:function(_){
			if(_.curr){
				_.curr.css({display:'block', top:-2000}).stop().animate({top:0},800, 'easeInOutExpo');	                
			}   
			if(_.prev){
				_.prev.stop().animate({top:-2000},800, 'easeInOutExpo', function(){ _.prev.css({display:'none'}); });
			}
            		
			//console.log(_.pren, _.n);			
            if ( (_.n == 0) && (_.pren != -1) ){
                showSplash();
            }
            if ((_.pren == 0) && (_.n>0)){
                hideSplash();  
            }
			if ( (_.pren == undefined) && (_.n >= 1) ){
                _.pren = -1;
                hideSplashQ();
            }
  		}
    });
	
	//content switch navs
	var nav = $('.menu');	
    nav.navs({
		useHash:true,
        defHash: '#!/page_SPLASH',
        hoverIn:function(li){            
			$('> a .over',li).stop().animate({top:0},800,'easeOutExpo');
			$('> .shadow',li).stop().animate({opacity:1},400, 'easeOutCubic');

        },
        hoverOut:function(li){  
		     if (!li.hasClass('with_ul') || !li.hasClass('sfHover')) {
				$('> a .over',li).stop().animate({top:90},400,'easeInOutExpo'); 
				$('> .shadow',li).stop().animate({opacity:0},400, 'easeOutCubic');
			 };			       
        }
    })     
    .navs(function(n){	
   	    content.tabs(n);
   	});		
});

// var dates = new Array();
function getHours(d, b){
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataHour'
        , async: false
        , success: function(msg){
            for (var i = 0, x = 0; i < msg.length; i++) {
                // console.log(typeOf(msg[i].date));
                // t = msg[i].time.slice(3,5);
                if (msg[i].date === d && msg[i].code === b ){
                    // if (x == 0)
                    data[x] = msg[i].value;
                        // data[x].time = msg[i].time;
                    // else data[x] = msg[i].value + data[x-1];
                    x++;
                    console.log();
                }
                else continue;
            }
        }
    });
    // console.log(data);
    return data;
}

function getDays(b, m){
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataDaily'
        , async: false
        , success: function(msg){
            for (var i = 0; i < msg.length; i++) {
                if (m === "w") {
                    if(msg[i].code === b){
                        // console.log(msg[i].code);
                        for (var j = 0; j < thisWeek.length; j++) {
                            if(msg[i].date === thisWeek[j])
                                data[j] = msg[i].value;

                            else if (!data[j]) 
                                data[j] = null;
                            console.log("WEEK ", msg[i].code);
                        }
                    } else continue;
                } else if (m === "m") {
                    if(msg[i].code === b){
                        // console.log(b);
                        for (var j = 0; j < thisMonth.length; j++) {
                            // if(j === 0)
                            //     data[j] =null;
                            if (msg[i].date === thisMonth[j]) {
                                data[j] = msg[i].value;
                                // console.log("TRUE", j, data[j]);
                            }
                            else if (!data[j])
                                data[j] = null;
                            // console.log(data[0]);
                        }
                    } else continue;
                }

            }
            // console.log(msg.length);
        }
    });
    // console.log(data);
    return data;
}

function getMonths(b){
    var data = new Array;
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: 'db/dataDaily'
        , asyn: false
        , success: function(msg) {
            for (var i = 0; i < msg.length; i++) {
                if(msg[i].code === b){
                    // console.log(b);
                    for (var j = 0; j <= thisMonth.length+1 ; j++) {
                        if(j === 0)
                        {
                            data[j]= null;
                        }
                        if (msg[i].date === thisMonth[j]) {
                            data[j] = msg[i].value;
                            // console.log("TRUE", j, data[j]);
                        }
                        else if (!data[j])
                            data[j] = null;
                        // console.log(data[0]);
                    }
                } else continue;
            }
            // console.log(data[0]);
        }

    });
    // console.log(data[0]);
    return data;
}
var options = {
    
    legend: {
        enabled: false
    },
    title: {
        text: 'ENERGY CONSUMPTION'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, 'rgba(5,0,0,0)']
                ]
            },
            lineWidth: 0.3,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        radius: 5
                    }
                }
            },
            shadow: true,
            states: {
                hover: {
                    lineWidth: 1
                }
            }
        },
        series: {
            animation: {
                duration: 2000,
                easing: 'swing'
            }
        }
    },
    loading: {
        hideDuration: 1000,
        showDuration: 1000
    },
    navigation: {
        buttonOptions: {
            align: 'right'
        }
    }
    
};



// var chart = new Highcharts.Chart(options);
function loadGraph(d, b){

    var codes = ['UNH', 'SM2', 'EAT', 'RHO', 'SUB', 'BAC', 'CUT', 'RRG', 'HOR', 'VML', 'VM2'
    , 'DEN', 'WMH', 'WIL', 'HSH', 'EMM', 'ELL', 'CAR', 'CRO', 'MAN', 'SEM', 'CHI'];

    var buildings = ['University Hall', 'SM2', 'Eaton House', 'Rhodes Hall', 
    'Students\' Union Building', 'Beveridge Arts Centre', 'Cutten House', 'Services Building Garage',
    'Horton Hall', 'Vaughan Memorial Library', 'VM2', 'Dennis House', 'War Memorial House',
    'Willett House', 'Huggins Science Hall', 'Emmerson Hall', 'Elliott Hall', 'Carnegie Hall', 
    'Crowell Tower', 'Manning Memorial Chapel', 'Seminary House', 'Chipman House' ];

    $('.total-box').hide("clip", 500);
    $('.graph-name p').hide("clip", 200);

    for (var i = 0; i < codes.length; i++) {
        if (d === "today" && b === codes[i]) {
            // $('.graph-name p').hide("clip", 500);
            // $('.total-box').hide("bounce", 500);
            var values = getHours(todayDate, codes[i]);
            var accum = 0;

            for (var j = 0; j < 47; j++) {
                if(values[j] != null){
                    accum += values[j];
                } else {
                    values[j] = null;
                }
            }

            var max = Math.max.apply(null,values);
            console.log(accum);
            $('.total-box>p').html('<b>' + accum + '</b>' + ' kwh<br/> <b><i>so far today</b></i>');
            $('.graph-name p').html(buildings[i]);
            // console.log(JSON.stringify(codes[i]));
            options.chart = {
                renderTo: 'container',
                borderColor: 'grey',
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true,
                // borderRadius: 10
                // alignTicks: true
                defaultSeriesType: 'area'
            }
            options.plotOptions = {
                lineColor: '#FFFFFF',
            }
            options.title = {
                align: 'left',
                text : "<b>Electricity Use (kw)</b> ",
                style: {
                    color: 'black',
                    fontSize: '12px',
                    fontWeight: 'bold'
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
                        fontWeight: 'bold'
                    },
                    rotation: -45,
                    y: 20,
                    x: 4
                },
                endOnTick: false,
                startOnTick: false,
                enabled: true,
                // tickPositions: ['12am', '02am'],
                minRange: 1800000
            }
            options.yAxis = {
                max: max * 1.5,
                title: false,
                labels: {
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }
            options.tooltip = {
                formatter: function(){
                    return Highcharts.dateFormat('%I:%M%p', this.x) + "<br/>" + "<b>" + this.y + "</b>" + " kw";
                },
                backgroundColor:'black',
                style: {
                    color: 'white'
                }
            }
            options.series = [{
                name: codes[i], 
                data: values,
                shadow: {
                    color: 'gray',
                    width: 5,
                    opacity: 0.15,
                    offsetY: -2,
                    offsetX: -2
                },
                marker: {
                    enabled: false  
                },
                pointStart: Date.UTC(year, month-1, day),
                pointInterval: 1800000                   
            }]
        }
        if (d === "week" && b === codes[i]) {

            $('.graph-name p').html( buildings[i] );
            var vl = getDays(codes[i], "w");
            var accum = 0;
            for (var j = 0; j < 7; j++) {
                if(vl[j] != null){
                    accum += vl[j];
                } else {
                    if (vl[j-1] != null && vl[j+1] == null || vl[2] == null){               
                        var current = getHours(todayDate, codes[i]);
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
            console.log(vl);
            $('.total-box>p').html('<b>' + accum + '</b>' + ' kwh<br/> <b><i>so far this week</b></i>');
            var max = Math.max.apply(null,vl);
            options.chart = {
                renderTo: 'container',
                defaultSeriesType: 'column',
                borderColor: 'darkgreen',
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            }
            options.title = {
                align: 'left',
                text : "<b>Electricity Use (kwh)</b> ",
                style: {
                    color: 'black',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            }
            options.plotOptions = {
                lineColor: '#FFFFFF',
            }
            options.tooltip = {
                formatter: function(){
                    return "<b>" + this.y + "</b>" + " kwh";
                },
                backgroundColor:'black',
                style: {
                    color: 'white'
                }
            }
            options.xAxis = {
                // type: 'datetime',
                labels: {
                    style: {
                        fontWeight: 'bold'
                    },
                    rotation: -45,
                    y: 20,
                    x: 4
                },
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                endOnTick: false,
                startOnTick: false,
                enabled: true
                // tickPositions: ['12am', '02am'],
                // minRange: 1800000
            }
            options.yAxis = {
                max: max * 1.2,
                title: false,
                labels: {
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }
            options.lang = {
                loading: "loading..."
            }
            options.series = [{
                name: codes[i], 
                data: vl,
                shadow: {
                    color: 'gray',
                    width: 5,
                    opacity: 0.15,
                    offsetY: -2,
                    offsetX: -2
                }                 
            }]
        }
        if (d === "month" && b === codes[i]) {
            var vMonth = getDays(codes[i], "m");
            var max = Math.max.apply(null,vMonth);

            var accum = 0;
            for (var j = 0; j < vMonth.length -1; j++) {
                if(vMonth[j] != null){
                    accum += vMonth[j];
                } else {
                    if (vMonth[j-1] != null && vMonth[j+1] == null || vMonth[2] == null){               
                        var current = getHours(todayDate, codes[i]);
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
            // console.log(vMonth2);
            $('.total-box>p').html('<b>' + accum + '</b>' + ' kwh<br/> <b><i>so far this month</b></i>');

            options.chart = {
                renderTo: 'container',
                defaultSeriesType: 'column',
                borderColor: 'darkgreen',
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            }
            options.title = {
                align: 'left',
                text : "<b>Electricity Use (kwh)</b> ",
                style: {
                    color: 'black',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            }
            options.tooltip = {
                formatter: function(){
                    return "<b>" + this.y + "</b>" + " kwh";
                },
                backgroundColor:'black',
                style: {
                    color: 'white'
                }
            }
            options.xAxis = {
                // type: 'datetime',
                labels: {
                    style: {
                        fontWeight: 'bold'
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
                // tickPositions: ['12am', '02am'],
                // minRange: 1800000
            }
            options.plotOptions = {
                lineColor: '#FFFFFF',
            }
            options.yAxis = {
                max: max * 1.2,
                title: false,
                labels: {
                    style: {
                        fontWeight: 'bold'
                    }
                }
            }
            options.lang = {
                loading: "loading..."
            }
            options.series = [{
                name: codes[i], 
                data: vMonth2,
                shadow: {
                    color: 'gray',
                    width: 5,
                    opacity: 0.15,
                    offsetY: -2,
                    offsetX: -2
                }                
            }]
            
        } 
    }
    var chart = new Highcharts.Chart(options);
    chart.showLoading(); 
    $('.total-box').show("clip", 500);
    $('.graph-name p').show("clip", 500); 
    setTimeout(function(){
        chart.hideLoading();    
    }, 800);
};

var choiceList = [
    {text: "University Hall", value: "UNH"},
    {text: "SM2", value: "SM2"},
    {text: "Eaton House", value: "EAT"},
    {text: "Rhodes Hall", value: "RHO" },
    {text: "Students' Union Building", value: "SUB"},
    {text: "Beveridge Arts Centre", value: "BAC"},
    {text: "Cutten House", value: "CUT"},
    {text: "Services Building Garage", value: "RRG"},
    {text: "Horton Hall", value: "HOR"},
    {text: "Vaughan Memorial Library", value: "VML"},
    {text: " VM2", value: "VM2"},
    {text: "Dennis House", value: "DEN"},
    {text: "War Memorial House", value: "WMH"},
    {text: "Willett House", value: "WIL"},
    {text: "Huggins Science Hall", value: "HSH"},
    {text: "Emmerson Hall", value: "EMM"},
    {text: "Elliott Hall", value: "ELL"},
    {text: "Carnegie Hall", value: "CAR"},
    {text: "Crowell Tower", value: "CRO"},
    {text: "Manning Memorial Chapel", value: "MAN"},
    {text: "Seminary House", value: "SEM"},
    {text: "Chipman House", value: "CHI"}
];
var choiceList_acs = [
    {text: "University Hall", value: "UNH"},
    {text: "SM2", value: "SM2"},
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
    {text: "Manning Memorial Chapel", value: "MAN"}
]
var choiceList_res = [
    {text: "Eaton House", value: "EAT"},
    {text: "Cutten House", value: "CUT"},
    {text: "Dennis House", value: "DEN"},
    {text: "Crowell Tower", value: "CRO"},
    {text: "Seminary House", value: "SEM"},
    {text: "Chipman House", value: "CHI"}
]

function buil_loader(tab, t) {
    $(tab).ddslick({
        width: 180,
        height: 150,
        data: t,
        selectText: "Select a Building",
        onSelected: function(data){
            // $("#list").click(function(){
            $('.col2').animate({opacity:0.1}, 1000); 
            $('.col3').animate({opacity:0.1}, 100);  
            var txt = data.selectedData.value;
            console.log(txt);
            $('.midBox').hide("drop", 1000);
            $('.infoSpinner').show('blind');
            setTimeout(function(){
                // $('.col2').animate({opacity:0.1}, 1000);
                // $('body').css({overflow:'inherit'});
                // start();s
                loadGraph("today", txt);
                $('.col2').animate({opacity:1}, 1000);
                $('.col3').animate({opacity:1}, 100);
                // $('.infoSpinner').hide('blind', 800);
                $('.el').show();                           
            }, 1000);
            console.log(txt);
            // loadGraph("today", txt);
            
            $('#today').addClass('ui-state-highlight');
            $('#week').removeClass('ui-state-highlight');
            $('#month').removeClass('ui-state-highlight');
            
            $("#today").click(function(){
                // $('.col2').animate({opacity:0.1}, 1000);  
                console.log("PRESSED(inb)");
                $('#today').addClass('ui-state-highlight');
                $('#week').removeClass('ui-state-highlight');
                $('#month').removeClass('ui-state-highlight');
                loadGraph("today", txt);
                $('.col2').animate({opacity:1}, 1000);
                $('.col3').animate({opacity:1}, 1000);
            });
            $("#week").click(function(){
                // $('.col2').animate({opacity:0.1}, 1000);  
                console.log("PRESSED(inc)");
                $('#today').removeClass('ui-state-highlight');
                $('#week').addClass('ui-state-highlight');
                $('#month').removeClass('ui-state-highlight');
                loadGraph("week", txt);
                $('.col2').animate({opacity:1}, 1000);
                $('.col3').animate({opacity:1}, 1000);
            });
            $("#month").click(function(){
                // $('.col2').animate({opacity:0.1}, 1000);  
                $('#month').addClass('ui-state-highlight');
                $('#today').removeClass('ui-state-highlight');
                $('#week').removeClass('ui-state-highlight');
                loadGraph("month", txt);
                $('.col2').animate({opacity:1}, 1000);
                $('.col3').animate({opacity:1}, 1000);
            });
            // });
        },
            
        // imagePosition: "left",
        
    });
}

$(window).ready(function() {	
	setTimeout(function () {					
  		$('.spinner').fadeOut();
		$('body').css({overflow:'inherit'});
		start();
        $('.infoBox').show("fold", 500);
	}, 5000);
    $('.infoBox').show("fold", 500);
    setTimeout(function() {
        $('.infoBox').hide("fold", 500);
    }, 15000);

    // $(".el").css({background-color:rgba(15, 15, 15, 0)});

    $('#today').button();
    $('#week').button();
    $('#month').button();
    $('#year').button();
    $('.el').hide("clip", 500);
    setTimeout(function(){
        $('.midBox').show('fold', 800);
    }, 1000);

    $('.menu a').click(function(){
        console.log("CLICKED");
        // $('.el').hide("clip", 500);
        // $('.col3').hide();
    });

    /////// icons
    $(".icons li").find("a").css({opacity:0.7});
    $(".icons li a").hover(function() {
        $(this).stop().animate({opacity:1 }, 400, 'easeOutExpo');           
    },function(){
        $(this).stop().animate({opacity:0.7 }, 400, 'easeOutExpo' );           
    });
    
    buil_loader("#contentE #list1" , choiceList_acs);
    $('#tabs a').click(function(e) {
        e.preventDefault();
        if($(this).attr("name") === "tab1"){
            buil_loader("#contentE #list1" , choiceList_acs);
            console.log($(this).attr("name"));
            $("#contentE #list2").ddslick('destroy');
        }
        if($(this).attr("name") === "tab2"){
            buil_loader("#contentE #list2" , choiceList_res);
            console.log($(this).attr("name"));
            $("#contentE #list1").ddslick('destroy');
        }
            
    });

    $("#today").click(function(){
        $('.col2').animate({opacity:0.1}, 100);
        $('.col3').animate({opacity:0.1}, 100);
    });
    $("#week").click(function(){
        $('.col2').animate({opacity:0.1}, 100);
        $('.col3').animate({opacity:0.1}, 100);
    });
    $("#month").click(function(){
        $('.col2').animate({opacity:0.1}, 100);
        $('.col3').animate({opacity:0.1}, 100);
    });
    // console.log($("#tabs li a").attr("name"));

    /////// close
    $(".close .over").css({opacity:0});
    $(".close").hover(function() {
        $(this).find(".over").stop().animate({opacity:1 }, 400, 'easeOutExpo');         
    },function(){
        $(this).find(".over").stop().animate({opacity:0 }, 400, 'easeOutExpo' );           
    });
    

    /////// leftbox
    $(".leftbox .over").hover(function(){
        $(this).find(".leftover").stop().animate({opacity: 1}, 400, 'easeOutExpo');
    },function(){
        $(this).find(".leftover").stop().animate({opacity: 0}, 400, 'easeOutExpo');
    });

    $("a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'dark',social_tools:false,allow_resize: true,default_width: 500,default_height: 344});
        
    /* ========== side slide ========== */
	/* ========== Slider ========= */
	$('#slider').nivoSlider();
    /* ======== ajax ======= */
    
     $('.menu a').click(function(){
        // 
    });  
});
