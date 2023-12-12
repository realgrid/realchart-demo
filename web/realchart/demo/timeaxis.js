/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Time Axis",
    xAxis: {
        type: 'time',
        title: 'Time',
        crosshair: true,
        padding: 0,
    },
    // yAxis: {
    //     title: 'Temparature'
    // },
    // series: {
    //     type: 'area',
    //     marker: false,
    //     data: range_data
    // },
    // yAxis: {
    //     title: 'Exchange Rate',
    //     minValue: 0.6
    // },
    // series: {
    //     type: 'area',
    //     marker: false,
    //     data: usdeur_data,
    //     baseValue: null
    // },
    yAxis: {
        title: 'Hestavollane'
    },
    series: {
        type: 'line',
        marker: {
            visible: true,
            shape: 'diamond',
            radius: 5,
            style: {
                stroke: 'white'
            }
        },
        xStart: "2023-07-12",
        xStep: 1000 * 60 * 60,
        data: [4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3, 4, 5, 4.9,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.1, 1, 1.9, 3.2, 3.8, 4.2]
    }
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
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config);
    }, 'default');
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
    createListBox(container, "XAxis.type", ['time', 'linear', 'log',], function (e) {
        config.xAxis.type = _getValue(e);
        chart.load(config);
    }, 'time');
    createListBox(container, "YAxis.type", ['linear', 'log'], function (e) {
        config.yAxis.type = _getValue(e);
        chart.load(config);
    }, 'linear');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
