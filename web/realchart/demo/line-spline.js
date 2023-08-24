const config = {
    options: {},
    title: "Line Series - Spline",
    xAxis: {
        type: 'category',
    },
    yAxis: {
    },
    series: {
        type: 'line',
        lineType: 'spline',
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['태풍', 9], 
            ['def', 7.5], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['ttt', 7],
            ['taaatt', 9],
            ['백두산', 11],
            ['낙동강', 2.5]
        ]
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
}

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
