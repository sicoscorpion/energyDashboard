function loadCompetitionsList() {
    var list = getCompetitions();
    // var builds = list.sort(dynamicSort("name"));

    for (var i = 0; i < list.length; i++) {
        if (list[i].status === "active" || list[i].status === "new"
        	|| list[i].status === "inBase" || list[i].status === "pendingStart") {
          $('#contentCompetition #tab1').append('<a rel="' + list[i].code + '"><p>' + 
          	list[i].name + '<br> ' + list[i].startDate + '</p></a>');
        } else if (list[i].status === "done") {
	        $('#contentCompetition #tab2').append('<a rel="' + list[i].code + '"><p>' +
	        	list[i].name + '</p></a>');
        }
    };
}

function competition_graph_loader(competitionCode, competitionName) {
	var competitions = getCompetitions();
	var currentCompetition = {};
	var buildings = [];
	var scores = [];

	for (var i = 0; i < competitions.length; i++) {
		if (competitions[i].code == competitionCode) {
			currentCompetition = competitions[i];
		};
	};

	for (var i = 0; i < currentCompetition.buildings.length; i++) {
		buildings[i] = currentCompetition.buildings[i].name;
		scores[i] = currentCompetition.buildings[i].score;
	};
	scores.sort().reverse();
	for (var i = 0; i < scores.length; i++) {
		if(scores[i] > 0)
			scores[i] = { y: scores[i], color: 'green'}
		if(scores[i] < 0)
			scores[i] = { y: scores[i], color: 'red'}
	};
	console.log(scores);
	$('.col1Competition').animate({ 'margin-left': "-37px" }, 500);
	$('#competitionsChart').highcharts({
		chart: {
      type: 'bar',
      renderTo: 'competitionsChart',
      shadow: false
    },
    title: {
      text: competitionName
    },
    legend: {
        enabled: false
    },
    xAxis: {
      categories: buildings,
      style: {
				color: 'black'
	    }
  	},
  	credits: {
        enabled: false
    },
    plotOptions: {
      bar: {
      	pointPadding: 0.2,
      	borderWidth: 0,
          dataLabels: {
              enabled: true,
              align: 'right',
              color: 'black',
              borderRadius: 5,
              backgroundColor: 'rgba(252, 255, 197, 0.7)',
              borderWidth: 1,
              borderColor: '#AAA',
              x: -5,
              style: {
                fontWeight: 'bolder',
                fontSize: '16px'
              },
              format: '{y} % '
          }
      }
  	},
  	tooltip: {
  		formatter: function(){
  				if (this.y < 0)
            return "<b>" + this.y + "</b>" + "% increase";
          if (this.y > 0)
            return "<b>" + this.y + "</b>" + "% reduction";
        },
        style: {
            color: 'black'
        }
      },
  	yAxis: {
  		enabled: false,
  		labels: {
  			enabled: false
  		},
  		title: false
  		// offset: 10,
  		// min: 0
  		// max: Math.max.apply(null, scores) * 1.5,
  		// title: false,
    //   labels: {
    //       style: {
    //           color: 'black'
    //       }
    //   }
  	},
  	series: [{
  		data: scores,
  		animation: false
  	}]
	});
	var chart = $('#competitionsChart').highcharts();
	chart.showLoading(); 
    setTimeout(function(){
        chart.hideLoading();    
    }, 1000);
}
function load_competitions() {
	loadCompetitionsList();
	// $(".col2Competition").hide();
	$('.col1Competition').animate({'margin-left': "-10px" });
	var competitions = getCompetitions();

	console.log(competitions[0]);

	// $(".competitions").html(JSON.stringify(competitions));
	$('.competition ').each(function() {
		var currentTab, ul = $(this);
		$(this).find('a').each(
			function(i)
			{
				var a = $(this).bind('click', function()
				{
					$("#contentCompetition #tab1").hide();
					$("#contentCompetition #tab2").hide();
					$("#tabs>li>a").removeClass("currentCompetition");
					if (currentTab) {
						ul.find('a.currentCompetition').removeClass('currentCompetition');
						$("#contentCompetition #" + currentTab).hide();
					}
					currentTab = $(this).addClass('currentCompetition').attr('name');
					$("#contentCompetition #" + currentTab).show().jScrollPane({hideFocus:true, autoReinitialise: true});                        return false;
				});
				$("#contentCompetition #" + a.attr('name')).hide();
			});
	});
	$(".competition li:first a").addClass("currentCompetition");
	$("#contentCompetition #tab1").show().jScrollPane({hideFocus:true, reinitialise: true});
	console.log(competitions[0].code)
	$("#contentCompetition #tab1 a").click(function(){
        competition_code = $(this).attr("rel");
        competition_name = $(this).text();
        console.log($(this).attr("rel") + $(this).text());
        competition_graph_loader($(this).attr("rel"), $(this).text());
    });
	$("#contentCompetition #tab2 a").click(function(){
        competition_code = $(this).attr("rel");
        competition_name = $(this).text();
        console.log($(this).attr("rel") + $(this).text());
        competition_graph_loader($(this).attr("rel"), $(this).text());
    });

}