
function getAccum(date, code) {
	var values = getHours(date, code);
    accum = 0;

    for (var j = 0; j < 47; j++) {
        if(values[j] != null){
            accum += values[j];
        } else {
            values[j] = null;
        }
    }
    return accum;
}

	var list = getBuildings();
function load_map() {
    console.log("LIST: ", list);
    if (list == null) {
      list = getBuildings();
    }
    var builds = list.sort(dynamicSort("name"));
    console.log("LIST: ", builds[0]);
    var locations = []
    for (var i = 0; i < builds.length; i++) {
    	console.log(builds[i].location.longitude)
    	locations[i] = [builds[i].name, builds[i].location.latitude, builds[i].location.longitude, builds[i].code, builds[i].type, builds[i].available]
    };
    console.log(locations)
	// var locations = [
	// 	["University Hall", 45.089176,-64.367034, "UNH", "ACADEMIC/SERVICE"],
	//     ["School of Education", 45.086410, -64.366338, "SM2", "ACADEMIC/SERVICE"],
	//     ["Eaton House", 45.086410, -64.366338, "EAT", "RESIDENCE"],
	//     ["Rhodes Hall", 45.088555,-64.36771, "RHO", "ACADEMIC/SERVICE" ],
	//     ["Students' Union Building", 45.08854,-64.364405, "SUB", "ACADEMIC/SERVICE"],
	//     ["Beveridge Arts Centre", 45.090358,-64.36462, "BAC", "ACADEMIC/SERVICE"],
	//     ["Cutten House", 45.085686,-64.366091, "CUT" , "RESIDENCE"],
	//     ["Services Building Garage", 45.084921,-64.36578, "RRG", "ACADEMIC/SERVICE"],
	//     ["Horton Hall", 45.088872, -64.368516, "HOR", "ACADEMIC/SERVICE"],
	//     ["Vaughan Memorial Library", 45.089957,-64.365242, "VML", "ACADEMIC/SERVICE"],
	//     ["Dennis House", 45.088872, -64.368516, "DEN", "RESIDENCE"],
	//     ["Denton Hall", 45.088652,-64.365466, "HDH", "ACADEMIC/SERVICE", "NA"],
	//     ["Biology Building", 45.08824,-64.368974, "BIO", "ACADEMIC/SERVICE", "NA"],
	//     ["Paterson Hall", 45.088281,-64.368261, "PAT", "ACADEMIC/SERVICE", "NA"],
	//     ["Fountain Commons", 45.087706,-64.36611, "FOU", "ACADEMIC/SERVICE", "NA"],
	//     ["K. C. Irving Centre", 45.08755,-64.368304, "KCI", "ACADEMIC/SERVICE", "NA"],
	//     ["Roy Jodrey Hall", 45.086675,-64.366174, "RJH", "RESIDENCE", "NA"],
	//     ["Chase Court", 45.086619,-64.365595, "CHA", "ACADEMIC/SERVICE", "NA"],
	//     ["Wheelock Dining Hall", 45.086672,-64.364227, "WHE", "ACADEMIC/SERVICE", "NA"],
	//     // ["K. C. Irving Centre", 45.08755,-64.368304, "KCI", "ACADEMIC/SERVICE"],
	//     ["War Memorial House", 45.088656,-64.369023, "WMH", "NA"],
	//     // ["Willett House",  "WIL"],
	//     ["Huggins Science Hall", 45.089358,-64.368826, "HSH", "ACADEMIC/SERVICE"],
	//     // ["Emmerson Hall",  "EMM"],
	//     ['Elliot Hall', 45.089888,-64.368858, "ELL", "ACADEMIC/SERVICE"],
	//     ["Carnegie Hall", 45.088160, -64.367325, "CAR", "ACADEMIC/SERVICE"],
	//     ["Crowell Tower", 45.084471, -64.364664, "CRO", "RESIDENCE"],
	//     // ["Manning Memorial Chapel",  "MAN"],
	//     ["Seminary House", 45.088843,-64.366047, "SEM", "RESIDENCE"],
	//     ["Chipman House", 45.087100, -64.366681, "CHI", "RESIDENCE"]
	// ];
			
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: new google.maps.LatLng(45.089042,-64.366197),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var infowindow = new google.maps.InfoWindow();
	var marker, i;
	for (i = 0; i < locations.length; i++) {  
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map,
		});
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			if (locations[i][5] === "inActive") {
				var contentString = "<div style=\"line-height:1.35;overflow:hidden;white-space:nowrap;\">" + "<b>" + locations[i][0] + "</b><br/><span style=\"font-size:10px\"> " + locations[i][4] + "</span><br/>" + "<img style=\"width: 70px; height: 60px; box-shadow: 1px 1px 10px 1px lightyellow; border: 2px rgb(79, 79, 79) solid;\"" 
				+ "src=\"images/buildings/thumbs/" + locations[i][3] + ".jpg\"/><br/>" 
				+ "<b> No data available </b> </div>";
			} else {
				var contentString = "<div style=\"line-height:1.35;overflow:hidden;white-space:nowrap;\">" + "<b>" + locations[i][0] + "</b><br/><span style=\"font-size:10px\"> " + locations[i][4] + "</span><br/>" + "<img style=\"width: 70px; height: 60px; box-shadow: 1px 1px 10px 1px lightyellow; border: 2px rgb(79, 79, 79) solid;\"" 
				+ "src=\"images/buildings/thumbs/" + locations[i][3] + ".jpg\"/><br/>" 
				+ "<a id=\"map-test\" href=\"#!/energy_use\" onclick=\"loadFromMap("
				+ locations[i][3] + ");\"> Energy Use</a> </div>";
			}
			return function() {
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
			}
		})(marker, i));
		google.maps.event.addListener(map, 'click', (function(marker, i) {
			return function() {
		    	infowindow.close(map, marker);
		    }
		})(marker, i));
	}
	setTimeout(function() {
		google.maps.event.trigger($(".menu a"), 'resize');
	}, 1000);
};
function loadFromMap(buil, type) {
    console.log(buil);
    var buildings = getBuildings();
    for (var i = 0; i < buildings.length; i++)
    {
        console.log("loadFromMap: " +  buil);
        // var ch_la = choiceList_acs[i].value;
        if (buildings[i].code === buil.id) { 
            
            
        
            bui = buildings[i].code;
            console.log(buildings[i].type)
            if (buildings[i].type === "academic") {
                buil_loader("#contentE #tab1" , buildings[i].code, buildings[i].name);
                $("#contentE #tab2").hide();
                $("#tabs>li>a").eq(1).removeClass("current");
                $(".elect>li>a").eq(0).addClass("current");
                $("#contentE #tab1").trigger('click');
                $("#contentE #tab1").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
                loadButtons(buildings[i].code, buildings[i].name)
            } else if (buildings[i].type === "residence") {
                buil_loader("#contentE #tab2" , buildings[i].code, buildings[i].name); 
                $("#contentE #tab1").hide();
                $("#tabs>li>a").eq(0).removeClass("current");
                $(".elect>li>a").eq(1).addClass("current");
                $("#contentE #tab2").trigger('click');
                $("#contentE #tab2").show().jScrollPane({hideFocus:true,  autoReinitialise: true});
                loadButtons(buildings[i].code, buildings[i].name)
            }
        }
    }
}
