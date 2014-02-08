include('js/html5.js');
//----jquery-plagins----
// include('js/jquery-1.6.1.min.js');

include('http://code.jquery.com/jquery-1.9.1.js');
include('js/jquery-ui-1.9.2.custom.min.js');
include('js/jquery.easing.1.3.js');
include('js/jquery.color.js');
include('js/jquery.bxSlider.js');
include('js/jquery.ddslick.min.js');
//----transform----
include('js/jquery.transform.js');
//----ContentSwitcher----
include('js/switcher.js');
// include('js/jquery.cycle.all.js')
//----contact form----
include('js/cform.js');
//----jScrollPane-----
include('js/jquery.mousewheel.js');
include('js/mwheelIntent.js');
include('js/jquery.jscrollpane.min.js');
//----nivo-slider-----
include('js/jquery.nivo.slider.js');
//----Lightbox--
include('js/jquery.prettyPhoto.js');
include('js/date.js');
//----jplayer-sound--
include('js/jquery.jplayer.min.js');
// ---highcharts ----
include('https://ajax.googleapis.com/ajax/libs/mootools/1.4.2/mootools-yui-compressed.js');
// include('js/adapters/mootools-adapter.js');
include('js/highcharts.js');
// include('js/themes/gray.js');

//----All-Scripts----
include('js/script.js');
//----Include-Function----
function include(url){ 
  document.write('<script type="text/javascript" src="'+ url +'" ></script>'); 
}
