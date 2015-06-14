include('js/html5.js');
//----jquery-plagins----
include('http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js')
include('js/jquery/jquery-ui-1.9.2.custom.min.js');
include('js/highstocks/highstock.js');
include('js/modules/exporting.js');
include('js/jquery/jquery.icheck.js');

include('js/jquery/jquery.easing.1.3.js');
include('js/jquery/jquery.color.js');
include('js/jquery/jquery.bxSlider.js');
include('js/jquery/gauge.min.js');
// include('js/jquery.flip.min.js');
//----transform----
include('js/jquery/jquery.transform.js');
//----ContentSwitcher----
include('js/switcher.js');
include('js/spin.js')
//----jScrollPane-----
include('js/jquery/jquery.jscrollpane.min.js');
include('js/jquery/jquery.mousewheel.js');
include('js/jquery/mwheelIntent.js');
//----nivo-slider-----
include('js/jquery/jquery.nivo.slider.js');
//----Lightbox--
include('js/jquery/jquery.prettyPhoto.js');
include('js/jquery/date.js');
include('js/jquery/jquery.picklist.js');
include('js/jquery/jquery.emulatedisabled.js');
// ---highcharts ----
// include('https://ajax.googleapis.com/ajax/libs/mootools/1.4.2/mootools-yui-compressed.js');
// // include('js/adapters/mootools-adapter.js');

// //----All-Scripts----
// include('http://maps.google.com/maps/api/js?sensor=false');
include('js/requests.js');
include('js/helpers.js');
include('js/store.js');
include('js/validate.js');
include('js/electricity.js');
// include('js/map.js');
// include('js/comparison.js');
// include('js/script.js');


//----Include-Function----
function include(url){ 
  document.write('<script type="text/javascript" src="'+ url +'" ></script>'); 
}

function start(){ 
	$('.header_bg').css({left:-950}).stop().delay(100).animate({left:0},800,'easeOutExpo');
    $('.grad1').stop().animate({top:-30},800,'easeOutExpo');
};

function showSplash(){
	setTimeout(function () {
		$('header').stop().animate({top:90},800,'easeOutExpo');
		$('.grad1').stop().animate({top:-10},800,'easeOutExpo');
	}, 200);
};

function hideSplash(){ 	
	//$('#menu_splash li.nav4').stop().animate({marginLeft:490, marginTop:333},800,'easeOutExpo', function(){ $('.menu_splash').css({display:'none'}); });
	$('header').stop().animate({top:40},800,'easeOutExpo');
	$('.grad1').stop().animate({top:-30},800,'easeOutExpo');
};

function hideSplashQ(){		
	$('header').css({top:40});
	$('.grad1').css({top:-30});
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

var week = newWeek.format();
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


tday  = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function GetClock(){
    d = new Date();
    nday   = d.getDay();
    nmonth = d.getMonth();
    ndate  = d.getDate();
    nyear = d.getYear();
    nhour  = d.getHours();
    nmin   = d.getMinutes();
    nsec   = d.getSeconds();

    if(nyear<1000) nyear=nyear+1900;

    if(nhour ==  0) {ap = " AM";nhour = 12;} 
    else if(nhour <= 11) {ap = " AM";} 
    else if(nhour == 12) {ap = " PM";} 
    else if(nhour >= 13) {ap = " PM";nhour -= 12;}

    if(nmin <= 9) {nmin = "0" +nmin;}
    if(nsec <= 9) {nsec = "0" +nsec;}

    var p = ""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+"  "+nhour+":"+nmin+" "+ap+"";
    $('#clockbox').html("<p>" + p + "</p>");
    setTimeout("GetClock()", 1000);
}

function loadBuildingsList() {
    var list = getBuildings();
    
    for (var i = 0; i < list.length; i++) {
        $(".list").append('<option>' + list[i].code + '</option>');
    };
    $('.list').change(function() {
        var building = $(this).val();
        if (building === "---") {
            $(".buildings-data input").each(function() {
                $(this).val("---");
            });
        };
        var info = getBuildingsInfo(building);
        $("#building_type").val(info[0].type);
        $("#building_name").val(info[0].name);
        $("#building_available").val(info[0].available);
        $("#building_size").val(info[0].size);
        $("#building_profile").val(info[0].profile);
        $("#building_built").val(info[0].built);
        $("#building_renovated").val(info[0].renovated);
        $("#building_feature").val(info[0].feature);
    }).change();
}

function loadCompetitionsManager() {
    $("#start_date, #end_date, #base_start_date, #base_end_date").datepicker();
    var list = getBuildings();
    var competitions = getCompetitions();
    var newCompID = makeid();
    var thisCompetitionCode = 0;
    if (competitions == "") {
        // newCompID = 1;
        console.log("XXXXXXXXX", competitions);
    } else {
        console.log(competitions.length);
        // var tmp = 0;
        for (var i = 0; i < competitions.length; i++) {
            $("#comp_id").append('<option>' + competitions[i].code + '</option>');
        };
        // newCompID = competitions.length+1;
        var competition = {};
        $('#comp_id').change(function() {
            var competitionID = $(this).val();
            for (var i = 0; i < competitions.length; i++) {
                if (competitions[i].code == competitionID) {
                    competition = competitions[i]
                    thisCompetitionCode = competitions[i].code
                }
            }
            if (competitionID === "---") {
                $("#comp-manager input").each(function() {
                    $(this).val("---");
                });
                $("#buildings option").each(function() {
                    $(this).remove();
                })
                $("#from_buildings option").each(function() {
                    if ($(this).attr("disabled") === "disabled"){
                        $(this).attr("disabled", false)
                    }
                });
                
            } else {
                // competitionID--;
                $("#comp_name").val(competition.name);
                $("#start_date").datepicker("setDate", new Date(competition.startDate));
                $("#end_date").datepicker("setDate", new Date(competition.endDate));
                $("#buildings option").each(function() {
                    $(this).remove();
                });
                $("#from_buildings option").each(function() {
                    if ($(this).attr("disabled") === "disabled"){
                        $(this).attr("disabled", false)
                    }
                })
                for (var i = 0; i < competition.buildings.length; i++) {
                    for (var j = 0; j < list.length; j++) {
                        if (list[j].name === competition.buildings[i].name) {
                            $("#buildings").append('<option value="' + j +'">' + list[j].name + '</option>');
                            $("#from_buildings option").each(function() {
                                if ($(this).attr("value") == j){
                                    $(this).attr("selected", false);
                                    $(this).attr("disabled", true)
                                } 
                            });
                           
                        }
                    };
                    console.log(competition.buildings[i].name);
                };
                $("#base_start_date").datepicker("setDate", new Date(competition.baseStart));
                $("#base_end_date").datepicker("setDate", new Date(competition.baseEnd));
                $("#comp_status").val(competition.status);
            }
        }).change();
    }

    var builds = list.sort(dynamicSort("name"));
    for (var i = 0; i < list.length; i++) {
        if (list[i].available === "Active")
            $("#buildings").append('<option value="' + i +'">' + list[i].name + '</option>');
    };
    $("#buildings").pickList({
        buttons: false,
    });
    $('#createCompetition').click(function(e) {
        e.preventDefault();
        var newCompetition = {}
        var buildingsParticipants = [];
        var x = 0;
        $("#buildings option").each(function(){
            buildingsParticipants[x] = {};
            buildingsParticipants[x].name = $(this).text();
            buildingsParticipants[x].score = 0;
            x++;     
        });
        console.log(buildingsParticipants);
        newCompetition.code = newCompID;
        newCompetition.name = $("#comp_name").val();
        newCompetition.startDate = new Date($("#start_date").val());
        newCompetition.endDate = new Date($("#end_date").val());
        newCompetition.baseStart = new Date($("#base_start_date").val());
        newCompetition.baseEnd = new Date($("#base_end_date").val());
        newCompetition.buildings = buildingsParticipants;
        
        newCompetition.status = $("#comp_status").val();
        if ($("#comp_status").val() === "---")
            newCompetition.status = "new"
        else
            newCompetition.status = $("#comp_status").val();
        if (newCompetition.code && newCompetition.name)
            createCompetition(newCompetition); // validation required
        $("#comp-manager input").each(function() {
            $(this).val("---");
        });
        $("#buildings option").each(function() {
            $(this).remove();
        })
        $("#from_buildings option").each(function() {
            if ($(this).attr("disabled") === "disabled"){
                $(this).attr("disabled", false)
            }
        });
        
        var after_competitions = getCompetitions();
        for (var i = 0; i < after_competitions.length; i++) {
            $("#comp_id").append('<option>' + after_competitions[i].code + '</option>');
        };
        alert("New Competition Created");
        location.reload();
       
    });

    $('#updateCompetition').click(function(e) {
        e.preventDefault();
        var curCompetition = {}
        
        var buildingsParticipants = [];
        var x = 0;
        $("#buildings option").each(function(){
            buildingsParticipants[x] = {};
            buildingsParticipants[x].name = $(this).text();
            for (var i = 0; i < competitions.length; i++) {
                for (var j = 0; j < competitions[i].buildings.length; j++) {
                   if (buildingsParticipants[x].name === competitions[i].buildings[j].name)
                    buildingsParticipants[x].score =  competitions[i].buildings[j].score
                };
            };
            x++;     
        });
        curCompetition.code = $('#comp_id').val();
        curCompetition.name = $("#comp_name").val();
        curCompetition.startDate = new Date($("#start_date").val());
        curCompetition.endDate = new Date($("#end_date").val());
        curCompetition.baseStart = new Date($("#base_start_date").val());
        curCompetition.baseEnd = new Date($("#base_end_date").val());
        curCompetition.buildings = buildingsParticipants;
        if ($("#comp_status").val() === "---")
            curCompetition.status = "new"
        else
            curCompetition.status = $("#comp_status").val();

        updateCompetition(curCompetition); // validation required
        $("#comp-manager input").each(function() {
            $(this).val("---");
        });
        $("#buildings option").each(function() {
            $(this).remove();
        })
        $("#from_buildings option").each(function() {
            if ($(this).attr("disabled") === "disabled"){
                $(this).attr("disabled", false)
            }
        });
    
        var after_competitions = getCompetitions();
        for (var i = 0; i < after_competitions.length; i++) {
            $("#comp_id").append('<option>' + after_competitions[i].code + '</option>');
        };
        alert("Competition " + curCompetition.code + " updated");
        location.reload();
        console.log(curCompetition.code);
    });
    
    $('#removeCompetition').click(function(e) {
        e.preventDefault();
        var compID = $("#comp_id").val();
        removeCompetition(compID);
        $("#comp-manager input").each(function() {
            $(this).val("---");
        });
        $("#buildings option").each(function() {
            $(this).remove();
        })
        $("#from_buildings option").each(function() {
            if ($(this).attr("disabled") === "disabled"){
                $(this).attr("disabled", false)
            }
        });
        alert("Competition Removed");
        location.reload();
    });
}

// function loadInterfaceInfo() {
//     var ui = getInterfaceInfo();
//     console.log(ui);
//     // $('.list').change(function() {
//         $(".interface-data #factor").val(ui[0].ghg);
//     // }).change();
// }

$(window).load(function() {	

    $.fn.gauge = function(opts) {
      this.each(function() {
        var $this = $(this),
            data = $this.data();

        if (data.gauge) {
          data.gauge.stop();
          delete data.gauge;
        }
        if (opts !== false) {
          data.gauge = new Gauge(this).setOptions(opts);
        }
      });
      return this;
    };
    GetClock(); 
    
	//content switch	
	$('#content>ul>li').eq(0).css({'visibility':'hidden', display:'none'});	
	var content = $('#content');	
	content.tabs({
        show:1,
        preFu:function(_){
    	   _.li.css({'visibility':'hidden',top:-2000});
		   //$('.main3').css({display:'none',opacity:0});
		   //$('.close').css({display:'none',opacity:0});
        },
        actFu:function(_){
			if(_.curr){
				_.curr.css({'visibility':'visible', top:-2000}).stop().animate({top:0},800, 'easeInOutExpo');	                
			}   
			if(_.prev){
				_.prev.stop().animate({top:-2000},800, 'easeInOutExpo', function(){ _.prev.css({'visibility':'hidden'})});
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
function adjustHeights(elem) {
      var fontstep = 2;
      if ($(elem).height()>$(elem).parent().height() || $(elem).width()>$(elem).parent().width()) {
        $(elem).css('font-size',(($(elem).css('font-size').substr(0,2)-fontstep)) + 'px').css('line-height',(($(elem).css('font-size').substr(0,2))) + 'px');
        adjustHeights(elem);
      }
    }
$(document).ready(function() {
    start();
    setTimeout(function () {
        $('.spinner').stop().animate({top:-2000},3000,'easeOutExpo');
        $('body').css({overflow:'inherit'});
        $('.infoBox').show("blind", 500);
        $("#clockbox").animate({opacity : 1}, 400, 'easeInExpo');
    }, 10);
    $(".icons li").find("a").css({opacity:0.7});
    $(".icons li a").hover(function() {
        $(this).stop().animate({opacity:1 }, 400, 'easeOutExpo');           
    },function(){
        $(this).stop().animate({opacity:0.7 }, 400, 'easeOutExpo' );           
    });

    loadCompetitionsManager();

    $('#updateAccount').click(function(e){
        e.preventDefault();
        var input = {};
        $('#editAccount :input').each(function(){
            if ($(this).attr('name') == "username")
                input.name = $(this).val();
            else if ($(this).attr('name') == "password")
                input.password = $(this).val();
        })
        console.log(input)
        updateAccount( input.name, input.password);
    });

    adjustHeights($("#home_txt").val(getInterfaceInfo()[0].homeText));
    $("#updateBuildingInfo").click(function(e) {
        var data = {};
        data.code = $(".list").val();
        
        $(".buildings-data input").each(function() {
            data[$(this).attr("name")] = $(this).val();
            
        });
        var validatedNewInfo = validateBuildingsInfo(data, getBuildings());
        var size = Object.size(validatedNewInfo)
        console.log(validatedNewInfo, size)
        if (size > 1 && validatedNewInfo != false) {
            updateBuildingInfo(validatedNewInfo)
            console.log(validatedNewInfo)    
        } else if (size == 1) {
            $('#notice').html("Nothing to save!")
            setTimeout(function() {
                $('#notice').html("")
            }, 3000)
        } else {
            $(".list").change();
        }
        
    });
    var ui = getInterfaceInfo();
    $("#updateGHGFactor").click(function() {
        var ghgFactor = {};
        ghgFactor.ghg = $("#factor").val();
        var factor = validateGHGFactor(ghgFactor, ui)
        if (factor != false)
            updateGHGFactor(factor);
        // console.log($("#factor").val())
    });
    
    $(".interface-data #factor").val(ui[0].ghg);
    loadBuildingsList();
    loadInterfaceInfo();


    /////// close
    $(".close .over").css({opacity:0});
    $(".close").hover(function() {
        $(this).find(".over").stop().animate({opacity:1 }, 400, 'easeOutExpo');         
    },function(){
        $(this).find(".over").stop().animate({opacity:0 }, 400, 'easeOutExpo' );           
    });
    
    $("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed:'normal',
        theme:'dark',
        social_tools:false,
        allow_resize: true,
        default_width: 500,
        default_height: 344
    });

});