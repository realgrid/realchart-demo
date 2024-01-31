/**
 * @demo
 * 
 */
const config = {
    title: "Log Axis",
    xAxis: {
        type: 'log',
        label: {
            firstStyle: {
                fill: 'gray',
                fontSize: '24px'
            }
        }
    },
    yAxis: {
        type: 'log'
    },
    series: {
        type: 'line',
        data: [1, 2, 4, 8, 16]
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
    createListBox(container, "XAxis.type", ['linear', 'log', 'category'], function (e) {
        config.xAxis.type = _getValue(e);
        chart.load(config);
    }, 'log');
    createCheckBox(container, "XAxis.tick.arrangeDecimals", function (e) {
        config.xAxis.tick.arrangeDecimals = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "YAxis.type", ['linear', 'log'], function (e) {
        config.yAxis.type = _getValue(e);
        chart.load(config);
    }, 'log');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
