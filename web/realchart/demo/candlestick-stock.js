/**
* @demo
* 
*/
const config = {
    title: "주식차트",
    options: {
        // animatable: false,
    },
    xAxis: {
        crosshair: true,
        // grid: true,
        type: "time",
        // startFit: 40000,
        tick: {
            step: 3
        },
    },
    crosshair: true,
    yAxis: {                 
        crosshair: true,
        baseValue: 50000,
    },
    body: {
        zoomType: "x",
    },
    series: {
        type: "candlestick",
        pointLabel: false,
        openField: "openprc",
        highField: "highprc",
        lowField: "lowprc",
        closeField: "closeprc",            
        data: data,
        padding:1,
        pointPadding: 0,
        pointStyleCallback: (args) => {
            if (args.index) {
                if (args.y > data[args.index - 1].openprc) {
                    return { fill: "red", stroke: "red" };
                } else {
                    return { fill: "blue", stroke: "blue" };
                }
            }
        },
        // xField: 'date',
    },
    seriesNavigator: {
        visible: true,
        series: {
            type: "bar",
            pointStyleCallback: (args) => {
                // console.log(args);
                
                if (args.index) {
                    if (args.y < data[args.index - 1].openprc) {
                        return { fill: "#ADD8E6", stroke: "#ADD8E6" };
                    } else {
                        return { fill: "#FFC0C0", stroke: "#FFC0C0" };
                    }
                }
                return { fill: "FFC0C0", stroke: "FFC0C0" };
            },
        },
    },
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);
    
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
