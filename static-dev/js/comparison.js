function dataObj(date, value, code){
    this.date = date;
    this.value = value;
}

function readData(from, to, code) {
    console.log(to);
    var data = new Array();
    $.ajax({
        type: 'GET'
        , dataType: 'json'
        , url: '/db/dataDaily/' + from + "/" + to + "/" + code
        , async: false
        , success: function(msg){
            for (var i = 0, x = 0; i < msg.length; i++) {
                if(msg[i].code === code) {
                    // data[i] = new dataObj();
                    var d = new Date(msg[i].date);
                    var day = d.getUTCDate();
                    var month = d.getUTCMonth();
                    var year = d.getUTCFullYear();
                    // data[i].date = Date.UTC(year, month, day);
                    // data[i].value = msg[i].value;
                    data[x] = [Date.UTC(year, month, day) , msg[i].value];
                    // console.log(data[x]);
                    x++;
                }
            }
        }
    });
    console.log(from + to + code);
    return data;
}
var today = new Date();
var dayToday = today.toString("MM-dd-yyyy");
console.log(dayToday);

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
            // buttonSpacing: 10,
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
        // tooltip: {
        //     formatter: function(){
        //         return "<b>" + this.y + "</b>" + " kwh";
        //     }
        // },
        // legend: {
        //     enabled: true,
        //     align: 'right',
        //     backgroundColor: '#FCFFC5',
        //     borderColor: 'black',
        //     borderWidth: 2,
        //     layout: 'vertical',
        //     verticalAlign: 'top',
        //     y: 100,
        //     shadow: true
        // },
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
            //  buttons: {
            //     contextButton: {
            //         enabled: false
            //     },
            //     exportButton: {
            //         text: 'Download',
            //         // Use only the download related menu items from the default context button
            //         // onclick: function () {
            //         //     this.downdoad();
            //         // }
            //         menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.splice(1)
            //     },
            //     printButton: {
            //         text: 'Print',
            //         onclick: function () {
            //             this.print();
            //         }
            //     }
            // }
            buttons: {
                contextButton: {
                    text: 'Export'
                }
            }
            // enabled: true
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
                        // textDecoration: 'underline'
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
                       // alert('I am an alert');
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
                    // fontWeight: 'bold',
                    color: 'black'
                }
            }
        },
        xAxis: {
            // type: 'datetime',
            labels: {
                style: {
                    // fontWeight: 'bold',
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
    console.log(m);
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

    // $('#contentC #tab1').tooltip({
    //     items: 'a',
    //     track: true
    // });    

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
                                console.log(currentTab)

                            }
                            currentTab = $(this).addClass('currentC').attr('name');
                            $("#contentC #" + currentTab).show().jScrollPane({hideFocus:true, reinitialise: true});
                            // console.log(currentTab);
                            return false;
                        }
                    );
                    $("#contentC #" + a.attr('name')).hide();
                    // console.log(currentTab);
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
        // console.log("ALEEEEEEEE" + dataBAC)
        }); 
        $('#toggle').click(function() {
            var chart = $('#chart_1').highcharts();
            var d = chart.xAxis[0].getExtremes().max;
            var t = new Date(d);
            alert((t.getUTCMonth()+1) + " " + t.getUTCDate() + " " + t.getUTCFullYear());
    });

    // $('.menu a').click(function() {
        // if ($(this).attr('href') === "#!/page_comparison") {
            setTimeout(function() {
                loadComp();
            }, 2000);
            // var chart = $('#chart_1').highcharts();
            // var series = chart.series;
            // for (var i = 0; i < series.length; i++) {
            //     series[i].hide();
            // };
            console.log($('.comp .currentC').attr('name'))
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
                            console.log(m);
                            $(m).css('borderColor', chart.series[i].color);
                            // $('#c1').iCheck('un/checked');
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
                    console.log(m);
                    $(m).css('borderColor', series.color)
                } 
                setTimeout(function(){
                    chart.hideLoading();    
                }, 100);
                
            });
            $('#contentC #tab1 input').on('ifUnchecked', function(event){
                var chart = $('#chart_1').highcharts();
                // console.log(chart.series);
                // var series = null;

                for (var i = 0; i < chart.series.length; i++) {
                    if (chart.series[i].name === $(this).attr('id')) {
                        // console.log("SERIES EXISTS"); 
                        if (chart.series[i].visible) {
                            chart.series[i].hide();
                            var m =  $('#contentC #tab1 a[rel=' + chart.series[i].name + ']');
                            console.log(m.attr('rel'));
                            m.css('borderColor', 'rgb(79, 79, 79)');

                            // $('#c1').iCheck('checked');
                        } else {
                            // chart.series[i].show();
                            // $('#c1').iCheck('un/checked');
                        } 
                        // exist = true;
                    } else {
                        // exist = false;
                        // console.log(chart.series[i].name + exist);
                    }
                };
            }); 

///////////////////////////////////////////////////////////////////////////////////////////////
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
                            // $('#c1').iCheck('un/checked');
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
                        data: (readData("01-01-2013", dayToday, $(this).attr('id'))).sort()
                    });
                    // $($('.highcharts-legend-item tspan')[0]).text('UNIVER')
                    series.show();
                    var m =  $('#contentC #tab2 a[rel=' + series.name + ']');
                    console.log(m);
                    $(m).css('borderColor', series.color)
                } 
                            
                
            });
            $('#contentC #tab2 input').on('ifUnchecked', function(event){
                var chart = $('#chart_1').highcharts();
                // console.log(chart.series);
                // var series = null;

                for (var i = 0; i < chart.series.length; i++) {
                    if (chart.series[i].name === $(this).attr('id')) {
                        // console.log("SERIES EXISTS"); 
                        if (chart.series[i].visible) {
                            chart.series[i].hide();
                            var m =  $('#contentC #tab2 a[rel=' + chart.series[i].name + ']');
                            console.log(m.attr('rel'));
                            m.css('borderColor', 'rgb(79, 79, 79)');

                            // $('#c1').iCheck('checked');
                        } else {
                            // chart.series[i].show();
                            // $('#c1').iCheck('un/checked');
                        } 
                        // exist = true;
                    } else {
                        // exist = false;
                        // console.log(chart.series[i].name + exist);
                    }
                };
            });

    
};