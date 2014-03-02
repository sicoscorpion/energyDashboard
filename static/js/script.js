
function start(){ 
	$('.header_bg').css({left:-950}).stop().delay(100).animate({left:0},800,'easeOutExpo');
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
// console.log(newWeek); // will be Monday
// console.log(newWeek.getMonth());
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
console.log(thisWeek);
$.fx.interval = 10;


var fd = Date.today().clearTime().moveToFirstDayOfMonth();
var firstday = fd.toString("MM/dd/yyyy");
var firstdaynum = parseInt(firstday.slice(3,5));


var ld = Date.today().clearTime().moveToLastDayOfMonth();
var lastday = ld.toString("MM/dd/yyyy");
var lastdaynum = parseInt(lastday.slice(3,5));
var thisMonth = new Array();
for (var i = 0; i < lastdaynum; i++) {
    var dd_1 = new Date();
    dd_1.setDate(fd.getDate() + i);
    thisMonth[i] = dd_1.format(); 
};

tday  =new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

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

    var p = ""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+"<br/> "+nhour+":"+nmin+" "+ap+"";
    $('#clockbox').html("<p>" + p + "</p>");
    setTimeout("GetClock()", 1000);
}

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

	// scroll
	// $('.sc_menu_wrapper').jScrollPane({
	// 	showArrows: false,
	// 	verticalGutter: 5,
	// 	verticalDragMinHeight: 100,
	// 	verticalDragMaxHeight: 100,
 //        autoReinitialise: true
	// });	
	
    // $('#content>ul>li').onClick(location.reload());

    
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




$(document).ready(function() {
	setTimeout(function () {					
  		$('.spinner').fadeOut();
		$('body').css({overflow:'inherit'});
		start();
        
        // showSplash();
        $('.infoBox').show("blind", 500);
        $("#clockbox").animate({opacity : 1}, 400, 'easeInExpo');
        // $('.infoBox').show("fold", 500);

	}, 6000);
    
    setTimeout(function() {
        $('.infoBox').hide("blind", 500);
    }, 15000);

    // $(".el").css({background-color:rgba(15, 15, 15, 0)});

    
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
	$('#slider').nivoSlider({
        effect: 'boxRainReverse,fade,boxRain',
        animSpeed: 1000,
        boxCols: 16,
        boxRows: 8,
        pauseTime: 5000,
        directionNav: false,
        controlNav: false
    });
    /* ======== ajax ======= */
    $(document).tooltip();
    buildElectricity();
    load_map();
    // $('.menu a').click(function(){
        // if ($(this).attr("href") === "#!/page_comparison") {
    load_comparisons();
        // }
    // });  
});
