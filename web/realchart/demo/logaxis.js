const config = {
    options: {
        animatable: false
    },
    title: "Log Axis",
    xAxis: {
        type: 'category',
        // type: 'linear'
        // type: 'log'
    },
    yAxis: {
        type: 'log'
    },
    series: {
        type: 'line',
        xStart: 1,
        data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
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
    createCheckBox(container, 'Point Marker', function (e) {
        config.series.marker.visible = _getChecked(e);
        chart.update(config);
    }, true);
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
