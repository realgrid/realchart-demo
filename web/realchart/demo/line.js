const config = {
    options: {},
    title: "Line Series 01",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'line',
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['카눈', 8], 
            ['def', 9], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
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
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.update(config);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
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

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
