include('js/html5.js');
//----jquery-plagins----
// include('js/jquery-1.6.1.min.js');

// include('http://code.jquery.com/jquery-1.9.1.js');
include('http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js')
include('js/jquery-ui-1.9.2.custom.min.js');
include('js/highstocks/highstock.js');
include('js/modules/exporting.js');
include('js/jquery.icheck.js');

include('js/jquery.easing.1.3.js');
include('js/jquery.color.js');
include('js/jquery.bxSlider.js');
include('js/gauge.min.js');
// include('js/jquery.flip.min.js');
//----transform----
include('js/jquery.transform.js');
//----ContentSwitcher----
include('js/switcher.js');
include('js/spin.js')
// include('js/jquery.cycle.all.js')
//----contact form----
include('js/cform.js');
//----jScrollPane-----
include('js/jquery.jscrollpane.min.js');
include('js/jquery.mousewheel.js');
include('js/mwheelIntent.js');
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

//----All-Scripts----
include('http://maps.google.com/maps/api/js?sensor=false');
include('js/electricity.js');
include('js/map.js');
include('js/comparison.js');
include('js/script.js');


//----Include-Function----
function include(url){ 
  document.write('<script type="text/javascript" src="'+ url +'" ></script>'); 
}
