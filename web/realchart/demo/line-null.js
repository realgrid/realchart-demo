/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: "Line - Null Point",
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
    },
    series: {
        type: 'line',
        // lineType: 'spline',
        pointLabel: true,
        data: [
            // 5.2, 5.7, 7.9, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6
            5.2, 5.7, 7.9, null, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6
        ]
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "Line Type", ['default', 'spline', 'step', 'step-backward'], function (e) {
        config.series.lineType = _getValue(e).split('-')[0];
        config.series.stepDir = _getValue(e).indexOf('backward') >= 0 ? 'backward' : 'forward';
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
