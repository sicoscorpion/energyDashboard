function dataObj(date, value, code){
    this.date = date;
    this.value = value;
}

function readData(from, to, code) {
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: '/db/dataDaily/' + from + "/" + to + "/" + code
        , async: false
        , success: function(msg){
            for (var i = 0, x = 0; i < msg.length; i++) {
                if(msg[i].code === code) {
                    var d = new Date(msg[i].date);
                    var day = d.getUTCDate();
                    var month = d.getUTCMonth();
                    var year = d.getUTCFullYear();
                    data[x] = [Date.UTC(year, month, day) , msg[i].value];
                    x++;
                }
            }
        }
    });
    return data;
}
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
            width:745,
            shadow: true,
            plotBorderColor: 'black',
            plotBorderWidth: 1
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
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'black'
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    text: 'Export'
                }
            }
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
                        color: '#000'
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
                y: topPosition -12
            });
            leftPosition += this.zoomText.getBBox().width;
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].attr({
                    x: leftPosition + 130,
                    y: topPosition -25
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

function load_comparisons() {
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