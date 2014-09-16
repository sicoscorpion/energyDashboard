
var today = new Date();
var dayToday = today.toString("MM-dd-yyyy");
var dataBAC = null;
function loadComp() {
    dataBAC = readData('01-01-2013', dayToday , "BAC");
 
    $("#chart_1").highcharts("StockChart", {
        chart: {
            renderTo: 'chart_1',
            type: 'line',
            height: 425,
            width:755,
            shadow: true,
            plotBorderColor: 'black',
            plotBorderWidth: 0
        },
        rangeSelector: {
            buttons: [{
                type: 'month',
                count: 1,
                text: '1Month'
            }, {
                type: 'month',
                count: 3,
                text: '3Months'
            }, {
                type: 'month',
                count: 6,
                text: '6Months'
            }, {
                type: 'year',
                count: 1,
                text: '1Year'
            }],
            buttonTheme: { // styles for the buttons
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                width: 60,
                r: 8,
                style: {
                    color: 'black',
                    // fontWeight: 'bold'
                },
                states: {
                    hover: {
                    },
                    select: {
                        fill: '#ffad00',
                        style: {
                            color: 'black'
                        }
                    }
                }
            },
            inputStyle: {
                color: 'black',
                // fontWeight: 'bold'
            },
            labelStyle: {
                color: '#ffad00',
                fontWeight: 'bold'
            },
            selected: 1
        },
        symbols: [ 'square', 'square' ],
        credits: {
            enabled: false
        },
        title: {
            align: 'left',
            text : "<b>Electricity Use (kwh)</b> ",
            style: {
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'black'
            },
            y: 20
        },
        exporting: {
            buttons: {
                contextButton: {
                    text: 'Export'
                }
            }
        },
        navigation: {
            // buttonOptions: {
            //     theme: {
            //         'stroke-width': 0,
            //         stroke: 'silver',
            //         r: 0,
            //         states: {
            //             hover: {
            //                 fill: '#ffad00'
            //             },
            //             select: {
            //                 stroke: '#039',
            //                 fill: '#ffad00'
            //             }
            //         },
            //         style: {
            //             color: '#000'
            //         }
            //     }
            // },
            // menuItemStyle: {
            //     fontWeight: 'normal',
            //     background: 'none'
            // },
            // menuItemHoverStyle: {
            //     fontWeight: 'bold',
            //     background: 'none',
            //     color: 'black'
            // }
            // buttonOptions: {
            //     enabled: false
            // }
        },
        plotOptions: {
            line: {
               events: {
                    legendItemClick: function () {
                       return false; 
                       // <== returning false will cancel the default action
                    }
                },
                showInLegend: true
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: 'black'
                }
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: 'black'
                }
            }
        },
        series: [
            {
                name: 'BAC',
                data: dataBAC.sort()
            }
        ]
    }, function(chart) {
        // apply the date pickers
        setTimeout(function() {
            $('input.highcharts-range-selector', $(chart.container).parent()).datepicker()
            }, 0)
        var orgHighchartsRangeSelectorPrototypeRender = Highcharts.RangeSelector.prototype.render;
        Highcharts.RangeSelector.prototype.render = function (min, max) {
            orgHighchartsRangeSelectorPrototypeRender.apply(this, [min, max]);
            var leftPosition = this.chart.plotLeft,
                topPosition = this.chart.plotTop,
                space = 0;
            this.zoomText.attr({
                x: leftPosition +125,
                y: topPosition -20
            });
            leftPosition += this.zoomText.getBBox().width;
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].attr({
                    x: leftPosition + 130,
                    y: topPosition -35
                });
                leftPosition += this.buttons[i].width + space;
            }
        };
    });

    var chart = $('#chart_1').highcharts();
    var m =  $('#contentC #tab1 a[rel=' + chart.series[0].name + ']');
    $(m).css('borderColor', chart.series[0].color)
    chart.showLoading(); 
    setTimeout(function(){
        chart.hideLoading();    
    }, 1000);
    var extremes = chart.xAxis[0].getExtremes(),
     start = new Date(extremes.min),
     end   = new Date(extremes.max);
    console.log(start, end);
    // Set the datepicker's date format
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText) {
            this.onchange();
            this.onblur();
        }
    });
}
function loadBuildingsList_comparisons() {
    var list = getBuildings();
    var builds = list.sort(dynamicSort("name"));
    var builds_inActive = [];
    for (var i = 0,j = 0; i < builds.length; i++) {
        if (builds[i].available === "Active") {
            if (builds[i].type === "academic") {
                $('#contentC #tab1').append('<a rel="' + builds[i].code + '"> <p>' + builds[i].name + '<input type="checkbox" id="' + builds[i].code + '" name="' + builds[i].name + '"/></p><img src="' + builds[i].image + '"/></a>');
                if (builds[i].code === "BAC")  $('input').iCheck('check');
            } else if (builds[i].type === "residence") {
                // console.log(builds[i].name);
                $('#contentC #tab2').append('<a rel="' + builds[i].code + '"> <p>' + builds[i].name + '<input type="checkbox" id="' + builds[i].code + '" name="' + builds[i].name + '"/></p><img src="' + builds[i].image + '"/></a>');
            }
        } else if (builds[i].available === "inActive") {
            builds_inActive[j] = builds[i];
            j++;
        }
    };
    for (var i = 0; i < builds_inActive.length; i++) {
        // console.log(builds_inActive[i].type)
        if (builds_inActive[i].type === "academic") {    
            $('#contentC #tab1').append('<a rel="' + builds_inActive[i].code + '" class="inActive" href="#" title="no data available at this time :("><p>' + builds_inActive[i].name + '</p><img src="' + builds_inActive[i].image + '"/></a>');
            
        } else if (builds_inActive[i].type === "residence") {
            $('#contentC #tab2').append('<a rel="' + builds_inActive[i].code + '" class="inActive" href="#" title="no data available at this time :("><p>' + builds_inActive[i].name + '</p><img src="' + builds_inActive[i].image + '"/></a>');
        }
    };
}

function load_comparisons() {
    loadBuildingsList_comparisons();
    $('#contentC #tab1 input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        increaseArea: '20%'
    });

    $('#contentC #tab2 input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        increaseArea: '20%' 
    });   

    $('.comp').each(
        function()
        {
            var currentTab, ul = $(this);
            $(this).find('a').each(
                function(i)
                {
                    var a = $(this).bind(
                        'click',
                        function()
                        {
                           $("#contentC #tab1").hide();
                           $(".comp li:first a").removeClass("currentC");
                            if (currentTab) {
                                ul.find('a.currentC').removeClass('currentC');
                                $("#contentC #" + currentTab).hide();
                            }
                            currentTab = $(this).addClass('currentC').attr('name');
                            $("#contentC #" + currentTab).show().jScrollPane({hideFocus:true, reinitialise: true});
                            return false;
                        }
                    );
                    $("#contentC #" + a.attr('name')).hide();
                }
            );
        }
    );
    $("#contentC #tab1").show().jScrollPane({hideFocus:true});
    $(".comp li:first a").addClass("currentC");

    var once = false;

    $('#hide').click(function() {
        var chart = $('#chart_1').highcharts();
            chart.addSeries({
                name: "BAC",
                data: dataBAC.sort()
            });
    }); 
    $('#toggle').click(function() {
        var chart = $('#chart_1').highcharts();
        var d = chart.xAxis[0].getExtremes().max;
        var t = new Date(d);
        alert((t.getUTCMonth()+1) + " " + t.getUTCDate() + " " + t.getUTCFullYear());
    });
    setTimeout(function() {
        loadComp();
    }, 2000);

    var currentTab = $('.comp .currentC').attr('name');
    $('#contentC #tab1 input').on('ifChecked', function(event){
        var chart = $('#chart_1').highcharts();                
        chart.showLoading();

        var exist = true;
        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === $(this).attr('id')) {
                console.log("SERIES EXISTS"); 
                exist = true;

                if (chart.series[i].visible) {
                    // chart.series[i].hide();
                    // $('#c1').iCheck('checked');
                } else {
                    chart.series[i].show();
                    var m =  $('#contentC #tab1 a[rel=' + chart.series[i].name + ']');
                    $(m).css('borderColor', chart.series[i].color);
                }
                break; 
            } else {
                exist = false;
                console.log(chart.series[i].name + exist);
            }
        };
        if (exist == false) {
            console.log("ADDING SERIES")

            series = chart.addSeries({
                name: $(this).attr('id'),
                data: (readData("01-01-2013", dayToday , $(this).attr('id'))).sort()
            });

            // $($('.highcharts-legend-item tspan')[0]).text('UNIVER')
            series.show();
            var m =  $('#contentC #tab1 a[rel=' + series.name + ']');
            $(m).css('borderColor', series.color)
        } 
        setTimeout(function(){
            chart.hideLoading();    
        }, 100);
        
    });
    $('#contentC #tab1 input').on('ifUnchecked', function(event){
        var chart = $('#chart_1').highcharts();

        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === $(this).attr('id')) {
                if (chart.series[i].visible) {
                    chart.series[i].hide();
                    var m =  $('#contentC #tab1 a[rel=' + chart.series[i].name + ']');
                    console.log(m.attr('rel'));
                    m.css('borderColor', 'rgb(79, 79, 79)');
                } 
            }
        };
    }); 
    $('#contentC #tab2 input').on('ifChecked', function(event){
        var chart = $('#chart_1').highcharts();                
        var exist = true;
        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === $(this).attr('id')) {
                console.log("SERIES EXISTS"); 
                exist = true;

                if (chart.series[i].visible) {
                    // chart.series[i].hide();
                    // $('#c1').iCheck('checked');
                } else {
                    chart.series[i].show();
                    var m =  $('#contentC #tab2 a[rel=' + chart.series[i].name + ']');
                    console.log(m);
                    $(m).css('borderColor', chart.series[i].color);
                }
                break; 
            } else {
                exist = false;
            }
        };
        if (exist == false) {
            console.log("ADDING SERIES")

            series = chart.addSeries({
                name: $(this).attr('id'),
                data: (readData("01-01-2013", dayToday, $(this).attr('id'))).sort()
            });
            // $($('.highcharts-legend-item tspan')[0]).text('UNIVER')
            series.show();
            var m =  $('#contentC #tab2 a[rel=' + series.name + ']');
            $(m).css('borderColor', series.color)
        } 
                    
        
    });
    $('#contentC #tab2 input').on('ifUnchecked', function(event){
        var chart = $('#chart_1').highcharts();

        for (var i = 0; i < chart.series.length; i++) {
            if (chart.series[i].name === $(this).attr('id')) {
                // console.log("SERIES EXISTS"); 
                if (chart.series[i].visible) {
                    chart.series[i].hide();
                    var m =  $('#contentC #tab2 a[rel=' + chart.series[i].name + ']');
                    console.log(m.attr('rel'));
                    m.css('borderColor', 'rgb(79, 79, 79)');
                } 
            } 
        };
    });
};